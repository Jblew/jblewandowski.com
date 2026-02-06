// Public key for encrypting patient data (RSA-2048)
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx8hxvEYIK2x1XJzPb0Ku
Uq9wEn3QaNUOO7AjxQx8HFxCd4On/Yp/jgIZwC0TeD/HZtTZttZ31H8nJfBFnMAG
VTcwwZROabdEXJN60wfp6a686gaSgvxvPU/F7sN39j1dGhHVvfPrlJlyw3b+/6re
bilKgrylCk8G/ry4aB5TphKE1Pqg/6lu5WiE2n/HMfxOLQFu0bWFpT9qmYyWjOJP
4eqXMgSJTdaq0FLYB2V/vCPFCnbMJyP4aNb2Ob52wDCzf96DHw1/kOdFTk698Wza
ZH436QFjIJiC2769X0LN964gfGSj/sH8/cR84yTnzd1UGO2sbjiUUyndr/JRun7q
TQIDAQAB
-----END PUBLIC KEY-----`;

function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\s/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

async function importPublicKey(): Promise<CryptoKey> {
    const keyBuffer = pemToArrayBuffer(PUBLIC_KEY_PEM);
    return await crypto.subtle.importKey(
        'spki',
        keyBuffer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
    );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export interface EncryptedPayload {
    encryptedKey: string;  // Base64 encoded RSA-encrypted AES key
    encryptedData: string; // Base64 encoded AES-encrypted data
    iv: string;            // Base64 encoded IV for AES
}

/**
 * Encrypts data using hybrid encryption:
 * 1. Generates a random AES-256 key
 * 2. Encrypts the data with AES-GCM
 * 3. Encrypts the AES key with RSA-OAEP
 *
 * This allows encrypting data of any size while maintaining security.
 */
export async function encryptData(data: object): Promise<EncryptedPayload> {
    const rsaPublicKey = await importPublicKey();

    // Generate random AES-256 key
    const aesKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt']
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt data with AES
    const dataString = JSON.stringify(data);
    const dataBuffer = new TextEncoder().encode(dataString);
    const encryptedDataBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        dataBuffer
    );

    // Export AES key and encrypt with RSA
    const aesKeyBuffer = await crypto.subtle.exportKey('raw', aesKey);
    const encryptedKeyBuffer = await crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        rsaPublicKey,
        aesKeyBuffer
    );

    return {
        encryptedKey: arrayBufferToBase64(encryptedKeyBuffer),
        encryptedData: arrayBufferToBase64(encryptedDataBuffer),
        iv: arrayBufferToBase64(iv.buffer)
    };
}
