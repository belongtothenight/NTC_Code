let aeslib = require('./lib/aes.js');

// const key = 1234567890123456;
const key = '2b28ab097eaef7cf15d2154f16a6883c';
const blockSize = 128; // 128, 192, 256
const iv = false; // 16 bytes (skipped)
const mode = 'ECB'; // ECB, CBC, CFB, OFB, CTR (skipped)
const padding = false; // PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None (skipped)
const outputType = 'String'; // Hex, Base64, String (skipped)

var aes = new aeslib.AES(key, blockSize, iv, mode, padding, outputType);
console.log('key: ' + aes.args.key);
console.log('expandedKey: ' + aes.args.w);

const plaintext = 'hello world 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
aes.encrypt(plaintext);
