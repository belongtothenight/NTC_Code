let aes_enc = require('./lib/aes_enc.js');
let aec_dec = require('./lib/aes_dec.js');
console.log('main.js')

const plaintext = 'hello world';
const key = '12345678901234567890123456789012';
const iv = '1234567890123456'; // 16 bytes (skipped)
const mode = 'ECB'; // ECB, CBC, CFB, OFB, CTR (skipped)
const padding = 'PKCS7'; // PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None (skipped)
const blockSize = 128; // 128, 192, 256
const outputType = 'Hex'; // Hex, Base64, String (skipped)

aes_enc.aes_enc(plaintext, key, iv, mode, padding, blockSize, outputType);
aec_dec.aes_dec();