import { mustGetEnv } from '../util'
import * as jose from 'jose'
import { readFileSync } from 'fs'
import { join } from 'path'

const TPAY_API_URL = mustGetEnv('TPAY_API_URL')
const TPAY_CLIENT_ID = mustGetEnv('TPAY_CLIENT_ID')
const TPAY_CLIENT_SECRET = mustGetEnv('TPAY_CLIENT_SECRET')

interface TokenResponse {
    access_token: string
    token_type: string
    expires_in: number
}

interface TpayTransactionRequest {
    amount: number
    description: string
    payer: {
        email: string
        name: string
    }
    callbacks: {
        payerUrls: {
            success: string
            error: string
        }
        notification: {
            url: string
        }
    }
}

interface TpayTransactionResponse {
    result: string
    transactionId: string
    transactionPaymentUrl: string
    status: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
    if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
        return cachedToken.token
    }

    const response = await fetch(`${TPAY_API_URL}/oauth/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: TPAY_CLIENT_ID,
            client_secret: TPAY_CLIENT_SECRET,
            grant_type: 'client_credentials',
        }),
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Tpay OAuth failed: ${response.status} ${text}`)
    }

    const data = await response.json() as TokenResponse
    cachedToken = {
        token: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
    }

    return data.access_token
}

export async function createTransaction(params: TpayTransactionRequest): Promise<TpayTransactionResponse> {
    const token = await getAccessToken()

    const body = {
        amount: params.amount,
        description: params.description,
        payer: params.payer,
        pay: {
            groupId: 150, // BLIK
        },
        callbacks: params.callbacks,
    }

    console.log('Creating Tpay transaction:', JSON.stringify(body, null, 2))

    const response = await fetch(`${TPAY_API_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const text = await response.text()
        console.error('Tpay transaction creation failed:', response.status, text)
        throw new Error(`Tpay transaction failed: ${response.status} ${text}`)
    }

    const data = await response.json() as TpayTransactionResponse
    console.log('Tpay transaction created:', data.transactionId)

    return data
}

// JWS Signature Verification
const isSandbox = TPAY_API_URL.includes('sandbox')
const jwsCertPath = join(__dirname, isSandbox ? 'jws_sandbox.pem' : 'jws_prod.pem')
const jwsCertPem = readFileSync(jwsCertPath, 'utf-8')

let cachedPublicKey: Awaited<ReturnType<typeof jose.importX509>> | null = null

async function getJwsPublicKey() {
    if (!cachedPublicKey) {
        cachedPublicKey = await jose.importX509(jwsCertPem, 'RS256')
    }
    return cachedPublicKey
}

export async function verifyJwsSignature(body: string, signature: string): Promise<boolean> {
    try {
        const publicKey = await getJwsPublicKey()

        // JWS detached signature format: header..signature (payload is empty in the token)
        // Reconstruct the full JWS with the body as payload
        const parts = signature.split('.')
        if (parts.length !== 3) {
            console.error('Invalid JWS signature format')
            return false
        }

        const [header, , sig] = parts
        const payloadBase64 = jose.base64url.encode(new TextEncoder().encode(body))
        const fullJws = `${header}.${payloadBase64}.${sig}`

        await jose.compactVerify(fullJws, publicKey)
        return true
    } catch (error) {
        console.error('JWS verification failed:', error)
        return false
    }
}
