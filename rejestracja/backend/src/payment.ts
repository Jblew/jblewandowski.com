import { Router } from "express";
import { createTransaction, verifyJWSSignature } from "./tpay";
import { verifyDiscountCode } from "./discount";
import { getProduct } from "./products";
import { createAndSendReceipt } from "./fakturownia";
import { mustGetEnv } from "./util";

const BASE_URL = mustGetEnv('BASE_URL')
const FRONTEND_URL = mustGetEnv('FRONTEND_URL')

interface CreatePaymentRequest {
    serviceId: string
    serviceName: string
    amount: number
    payerEmail: string
    payerName: string
    discountCode?: string
    discountPercent?: number
}

export function setupPaymentRoutes(router: Router) {
    router.post('/api/createPayment', async (req, res) => {
        try {
            const body: CreatePaymentRequest = req.body

            if (!body.serviceId || !body.payerEmail || !body.payerName) {
                return res.status(400).json({ error: 'Missing required fields' })
            }

            // Verify product exists and get correct price from backend
            const product = getProduct(body.serviceId)
            if (!product) {
                return res.status(400).json({ error: 'Invalid service ID' })
            }

            // Use backend price, not client-provided price
            let finalAmount = product.pricePln
            let discountPercent = 0

            if (body.discountCode && body.discountPercent !== undefined) {
                const discount = verifyDiscountCode(body.discountCode)
                if (!discount) {
                    return res.status(400).json({ error: 'Invalid discount code' })
                }
                if (body.discountPercent < discount.discountPercentMin || body.discountPercent > discount.discountPercentMax) {
                    return res.status(400).json({ error: 'Discount percent out of allowed range' })
                }
                discountPercent = body.discountPercent
                finalAmount = Math.max(1, Math.round(product.pricePln * (100 - discountPercent) / 100))
            }

            console.log(`Creating payment: service=${product.name}, original=${product.pricePln}, discount=${discountPercent}%, final=${finalAmount}`)

            const transaction = await createTransaction({
                amount: finalAmount,
                description: `Wizyta - ${product.name}`,
                payer: {
                    email: body.payerEmail,
                    name: body.payerName,
                },
                callbacks: {
                    payerUrls: {
                        success: `${FRONTEND_URL}?payment=success`,
                        error: `${FRONTEND_URL}?payment=error`,
                    },
                    notification: {
                        url: `${BASE_URL}api/tpay/webhook`,
                    },
                },
            })

            return res.json({
                transactionPaymentUrl: transaction.transactionPaymentUrl,
                transactionId: transaction.transactionId,
            })
        } catch (error) {
            console.error('Payment creation error:', error)
            return res.status(500).json({ error: 'Failed to create payment' })
        }
    })

    router.post('/api/tpay/webhook', async (req, res) => {
        const { result, body, status } = await verifyJWSSignature(req)
        console.dir({ result, body, status })
        if (body) {
            console.log('Tpay notification:', body.tr_id, body.tr_status)
        }
        const isSuccess = body?.tr_status === 'TRUE'

        if(isSuccess) {
            console.log('Sukces płatności, wysyłanie paragonu')
            const email = body?.tr_email
            if(!email) {
                console.log('400 — brak email')
                return res.status(400).end('FALSE — brak email')
            }

            try {
                await createAndSendReceipt({
                    buyerEmail: email,
                    description: body!.tr_desc,
                    amount: parseFloat(body!.tr_amount),
                })
                console.log('E-paragon sent to:', email)
            } catch (err) {
                console.error('Failed to create/send receipt:', err)
            }
        }
        return res.status(status).end(result)
    })
}
