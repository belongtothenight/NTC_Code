let aes_enc = require('./lib/aes_enc.js');
let aes_dec = require('./lib/aes_dec.js');
let aeslib = require('./lib/aes.js');
console.log('main.js')

const plaintext = 'hello world 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
const key = '12345678901234567890123456789012';
const iv = '1234567890123456'; // 16 bytes (skipped)
const mode = 'ECB'; // ECB, CBC, CFB, OFB, CTR (skipped)
const padding = 'PKCS7'; // PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None (skipped)
const blockSize = 128; // 128, 192, 256
const outputType = 'Hex'; // Hex, Base64, String (skipped)

var aes = new aeslib.AES();