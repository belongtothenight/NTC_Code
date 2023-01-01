let aeslib = require('./lib/aes.js');
console.log('main.js')

const key = '12345678901234567890123456789012';
const blockSize = 128; // 128, 192, 256
const iv = false; // 16 bytes (skipped)
const mode = 'ECB'; // ECB, CBC, CFB, OFB, CTR (skipped)
const padding = false; // PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None (skipped)
const outputType = 'String'; // Hex, Base64, String (skipped)

var aes = new aeslib.AES(key, blockSize, iv, mode, padding, outputType);

const plaintext = 'hello world 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
