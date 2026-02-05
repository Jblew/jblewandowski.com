import { mustGetEnv } from './util'
import { readFileSync } from 'fs'
import { join } from 'path'
import { createVerify, X509Certificate } from 'crypto'
import { type Request } from 'express'

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

export interface TpayNotificationPayload {
    id: string
    tr_id: string
    tr_date: string
    tr_crc: string
    tr_amount: string
    tr_paid: string
    tr_desc: string
    tr_status: string
    tr_error: string
    tr_email: string
    md5sum: string
    test_mode: string
    card_token?: string
    token_expiry_date?: string
    card_tail?: string
    card_brand?: string
}

export interface VerifyJWSResult {
    result: string
    body: TpayNotificationPayload | null
    status: number
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

export async function verifyJWSSignature(req: Request): Promise<VerifyJWSResult> {
  const fail = (reason: string): VerifyJWSResult => ({
    result: `FALSE - ${reason}`,
    body: null,
    status: 400,
  })

  const jws = req.headers["x-jws-signature"];

  if (!jws || typeof jws !== 'string') {
    return fail("Missing JWS header")
  }

  const jwsData = jws.split(".");
  const headerPart = jwsData[0];
  const signaturePart = jwsData[2];
  const rawBody = new URLSearchParams(req.body).toString();

  const headerDecoded = Buffer.from(headerPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("ascii");
  const headerJson = JSON.parse(headerDecoded);

  if (!headerJson.x5u) {
    return fail("Missing x5u header")
  }

  if (!headerJson.x5u.startsWith("https://secure.tpay.com")) {
    return fail("Wrong x5u URL")
  }

  const [signingCert, caCert] = await Promise.all([fetch(headerJson.x5u).then((res) => res.text()), fetch("https://secure.tpay.com/x509/tpay-jws-root.pem").then((res) => res.text())]);

  const x5uCert = new X509Certificate(signingCert);
  const caCertPublicKey = new X509Certificate(caCert).publicKey;

  if (!x5uCert.verify(caCertPublicKey)) {
    return fail("Signing certificate is not signed by Tpay CA certificate")
  }

  const payload = Buffer.from(rawBody, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const decodedSignature = Buffer.from(signaturePart.replace(/-/g, "+").replace(/_/g, "/"), "base64");

  const verifier = createVerify("SHA256");
  verifier.update(`${headerPart}.${payload}`);
  verifier.end();

  const publicKey = x5uCert.publicKey;
  const isValid = verifier.verify(publicKey, decodedSignature);

  if (!isValid) {
    return fail("Invalid JWS signature")
  }

  return {
    result: "TRUE",
    body: req.body as TpayNotificationPayload,
    status: 200,
  }
}