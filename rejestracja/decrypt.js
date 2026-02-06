#!/usr/bin/env node
/**
 * Decryption script for patient data
 * Usage: node decrypt.js '<encrypted_json>'
 *
 * The encrypted JSON should contain: encryptedKey, encryptedData, iv
 */

const crypto = require('crypto');
const path = require('path')
const fs = require('fs')

const PRIVATE_KEY = fs.readFile(path.join(__dirname), 'pk.k');

function decrypt(encryptedPayload) {
    const { encryptedKey, encryptedData, iv } = encryptedPayload;

    // Decode base64
    const encryptedKeyBuffer = Buffer.from(encryptedKey, 'base64');
    const encryptedDataBuffer = Buffer.from(encryptedData, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');

    // Decrypt AES key with RSA
    const aesKey = crypto.privateDecrypt(
        {
            key: PRIVATE_KEY,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        encryptedKeyBuffer
    );

    // Decrypt data with AES-GCM
    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, ivBuffer);

    // AES-GCM appends auth tag at the end (last 16 bytes)
    const authTag = encryptedDataBuffer.slice(-16);
    const ciphertext = encryptedDataBuffer.slice(0, -16);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf8'));
}

// Main
if (process.argv.length < 3) {
    console.log('Usage: node decrypt.js \'{"encryptedKey":"...","encryptedData":"...","iv":"..."}\'');
    console.log('');
    console.log('Or pipe JSON input:');
    console.log('  echo \'{"encryptedKey":"...","encryptedData":"...","iv":"..."}\' | node decrypt.js -');
    process.exit(1);
}

const input = process.argv[2];

if (input === '-') {
    // Read from stdin
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => {
        try {
            const payload = JSON.parse(data.trim());
            const decrypted = decrypt(payload);
            console.log('\n=== ODSZYFROWANE DANE PACJENTA ===\n');
            console.log(JSON.stringify(decrypted, null, 2));
        } catch (err) {
            console.error('Błąd deszyfrowania:', err.message);
            process.exit(1);
        }
    });
} else {
    try {
        const payload = JSON.parse(input);
        const decrypted = decrypt(payload);
        console.log('\n=== ODSZYFROWANE DANE PACJENTA ===\n');
        console.log(JSON.stringify(decrypted, null, 2));
    } catch (err) {
        console.error('Błąd deszyfrowania:', err.message);
        process.exit(1);
    }
}
