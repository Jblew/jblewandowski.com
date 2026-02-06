// Public key for encrypting patient data (RSA-2048)
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyBciVd5aMxzp3ivvOCHv
mg5UT1fHkwyot/eoStRCgPf7xG7fkt7YxD+AeEHQ6/uvNu45QxeeABH/dsoWErAd
9V49WNmKvalvNLJCFGROoZpxstSITpt+/XGURYbddHWfBuFFRnbcdimrcRYOK6WQ
d5O1mu0VUXaa2WdwxFUubuJYdurCiAnrbEMOLxW4Rc+wnTxw4Df27HCn0JZ8EIyt
mAdrLfRzTM8eB4efchIAQ4fci6fZ+r2BsTLxLt13cVzp+jTGvTHpMSF8WKISHGiH
g1lrVoG9wVW3So8TS3fpyqBWkWbMmW05Xh+6xJMo3VRBcvwOI+yYmsSJjb6/tZzc
SwIDAQAB
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
