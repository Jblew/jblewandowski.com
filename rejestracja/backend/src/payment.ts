import { Router } from "express";
import { verifyDiscountCode } from "./discount";
import { getProduct } from "./products";
import { createReceipt, sendReceiptByEmail } from "./fakturownia";

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

            const positions = [{
                name: `Wizyta — ${product.name}`,
                tax: 'zw' as const,
                total_price_gross: product.pricePln,
                quantity: 1,
            }]

            if (discountPercent > 0) {
                const discountAmount = product.pricePln - finalAmount
                positions.push({
                    name: `Rabat (kod ${body.discountCode})`,
                    tax: 'zw' as const,
                    total_price_gross: -discountAmount,
                    quantity: 1,
                })
            }

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
}
