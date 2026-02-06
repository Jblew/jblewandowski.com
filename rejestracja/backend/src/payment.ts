import { Router } from "express";
import { verifyDiscountCode } from "./discount";
import { getProduct } from "./products";
import { createReceipt, sendReceiptByEmail, fiscalizeReceipt, ReceiptPosition } from "./fakturownia";

interface EncryptedPayload {
    encryptedKey: string
    encryptedData: string
    iv: string
}

interface SendReceiptRequest {
    serviceId: string
    payerEmail: string
    discountCode?: string
    discountPercent?: number
    encryptedPatientData?: EncryptedPayload
}

export function setupPaymentRoutes(router: Router) {
    router.post('/api/sendReceipt', async (req, res) => {
        try {
            const body: SendReceiptRequest = req.body

            if (!body.serviceId || !body.payerEmail) {
                return res.status(400).json({ error: 'Brak wymaganych pól' })
            }

            const product = getProduct(body.serviceId)
            if (!product) {
                return res.status(400).json({ error: 'Nieprawidłowa usługa' })
            }

            let finalAmount = product.pricePln
            let discountPercent = 0

            if (body.discountCode && body.discountPercent !== undefined) {
                const discount = verifyDiscountCode(body.discountCode)
                if (!discount) {
                    return res.status(400).json({ error: 'Nieprawidłowy kod zniżkowy' })
                }
                if (body.discountPercent < discount.discountPercentMin || body.discountPercent > discount.discountPercentMax) {
                    return res.status(400).json({ error: 'Procent zniżki poza dozwolonym zakresem' })
                }
                discountPercent = body.discountPercent
                finalAmount = Math.max(1, Math.round(product.pricePln * (100 - discountPercent) / 100))
            }

            console.log(`Wysyłanie paragonu: usługa=${product.name}, cena=${product.pricePln}, zniżka=${discountPercent}%, końcowa=${finalAmount}`)

            // Log encrypted patient data
            if (body.encryptedPatientData) {
                const logMatchingID = '8d4b8ahi4dza4fc68a18mj021b9uya08'
                console.log(`${logMatchingID} DANE WIZYTY  ${body.payerEmail} ${JSON.stringify(body.encryptedPatientData)}`)
            }

            // Actual discount % after clipping price to minimum 1 PLN
            const actualDiscountPercent = Math.floor(((product.pricePln - finalAmount) / product.pricePln) * 100)
            const positions: ReceiptPosition[] = [{
                name: `Wizyta — ${product.name}`,
                tax: 'zw' as const,
                total_price_gross: product.pricePln,
                discount_percent: actualDiscountPercent,
                quantity: 1,
            }]


            const receipt = await createReceipt({
                buyerEmail: body.payerEmail,
                positions,
            })
            await sendReceiptByEmail(receipt.id)

            console.log('Paragon wysłany na:', body.payerEmail)

            return res.json({ success: true })
        } catch (error) {
            console.error('Błąd wysyłania paragonu:', error)
            return res.status(500).json({ error: 'Nie udało się wysłać paragonu' })
        }
    })

    // Webhook wywoływany przez Fakturownię po udanej płatności
    router.get('/api/payment-webhook', async (req, res) => {
        try {
            const invoiceId = req.query.invoice_id as string
            const paid = req.query.paid as string

            console.log('Payment webhook received:', { invoiceId, paid })

            if (!invoiceId) {
                console.error('Webhook: brak invoice_id')
                return res.status(400).json({ error: 'Brak invoice_id' })
            }

            if (paid !== 'true') {
                console.log('Webhook: płatność nieudana, pomijam fiskalizację')
                return res.json({ success: true, fiscalized: false })
            }

            const receiptId = parseInt(invoiceId, 10)
            if (isNaN(receiptId)) {
                console.error('Webhook: nieprawidłowe invoice_id:', invoiceId)
                return res.status(400).json({ error: 'Nieprawidłowe invoice_id' })
            }

            await fiscalizeReceipt(receiptId)
            console.log('Webhook: paragon sfiskalizowany, id:', receiptId)

            return res.json({ success: true, fiscalized: true, receiptId, invoiceId })
        } catch (error) {
            console.error('Błąd webhooka płatności:', error)
            return res.status(500).json({ error: 'Błąd fiskalizacji' })
        }
    })
}
