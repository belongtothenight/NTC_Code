let aeslib = require('./lib/aes.js');

// const key = 1234567890123456;
const key = '2b7e151628aed2a6abf7158809cf4f3c';
const blockSize = 128; // 128, 192, 256
const iv = false; // 16 bytes (skipped)
const mode = 'ECB'; // ECB, CBC, CFB, OFB, CTR (skipped)
const padding = false; // PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None (skipped)
const outputType = 'String'; // Hex, Base64, String (skipped)

var aes = new aeslib.AES(key, blockSize, iv, mode, padding, outputType);
// console.log('key: ' + aes.args.key);
console.log('Initialized AES');

const plaintext = '3243f6a8885a308d313198a2e0370734';
aes.encrypt(plaintext);
