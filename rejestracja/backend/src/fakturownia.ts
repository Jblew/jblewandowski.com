import { mustGetEnv } from './util'

const FAKTUROWNIA_URL = mustGetEnv('FAKTUROWNIA_URL') // e.g. https://PREFIX.paragony.pl
const FAKTUROWNIA_API_TOKEN = mustGetEnv('FAKTUROWNIA_API_TOKEN')
const SELLER_NAME = "Jędrzej Lewandowski"
const SELLER_TAX_NO = "7393970235"

export interface ReceiptPosition {
    name: string
    tax: number | string
    total_price_gross: number
    quantity: number
    discount_percent?: number
}

interface CreateReceiptParams {
    buyerEmail: string
    positions: ReceiptPosition[]
}

interface ReceiptResponse {
    id: number
    kind: string
    number: string
    status: string
}

export async function createReceipt(params: CreateReceiptParams): Promise<ReceiptResponse> {
    const today = new Date().toISOString().split('T')[0]
    const hasDiscounts = params.positions.some((p) => typeof p.discount_percent === 'number' && p.discount_percent > 0)
    const body = {
        invoice: {
            kind: 'receipt',
            sell_date: today,
            issue_date: today,
            payment_to: today,
            seller_name: SELLER_NAME,
            seller_tax_no: SELLER_TAX_NO,
            buyer_email: params.buyerEmail,
            positions: params.positions,
            ...(hasDiscounts ? {
                show_discount: true,
                discount_kind: "percent_unit_gross"
            }: {})
        }
    }

    console.log('Creating receipt:', JSON.stringify(body, null, 2))

    const response = await fetch(`${FAKTUROWNIA_URL}/invoices.json`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${FAKTUROWNIA_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Fakturownia create receipt failed: ${response.status} ${text}`)
    }

    const data = await response.json() as ReceiptResponse
    console.log('Receipt created:', data.id, data.number)
    return data
}

export async function sendReceiptByEmail(receiptId: number): Promise<void> {
    console.log('Sending receipt by email, id:', receiptId)

    const response = await fetch(`${FAKTUROWNIA_URL}/invoices/${receiptId}/send_by_email.json`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${FAKTUROWNIA_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Fakturownia send email failed: ${response.status} ${text}`)
    }

    console.log('Receipt email sent successfully')
}

export async function fiscalizeReceipt(receiptId: number): Promise<void> {
    console.log('Fiscalizing receipt:', receiptId)

    const url = `${FAKTUROWNIA_URL}/invoices/fiscal_print.json?id=${receiptId}&mode=e-receipt`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${FAKTUROWNIA_API_TOKEN}`,
        },
    })
    console.log('Fiscalization response', response)
    console.dir(response)

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Fakturownia fiscalization failed: ${response.status} ${text}`)
    }

    console.log('Receipt fiscalized successfully, id:', receiptId)
}

export async function createAndSendReceipt(params: {
    buyerEmail: string
    description: string
    amount: number
}): Promise<void> {
    const receipt = await createReceipt({
        buyerEmail: params.buyerEmail,
        positions: [{
            name: params.description,
            tax: 'zw', // usługi medyczne — zwolnione z VAT
            total_price_gross: params.amount,
            quantity: 1,
        }],
    })

    await sendReceiptByEmail(receipt.id)
}
