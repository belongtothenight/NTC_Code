let aeslib = require('./lib/aes.js');

// const key = 1234567890123456;
const key = '5445414d53434f525049414e31323334';
const blockSize = 128; // 128, 192, 256
const iv = false; // 16 bytes (skipped)
const mode = 'ECB'; // ECB, CBC, CFB, OFB, CTR (skipped)
const padding = false; // PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None (skipped)
const outputType = 'String'; // Hex, Base64, String (skipped)

var aes = new aeslib.AES(key, blockSize);
// console.log('key: ' + aes.args.key);
console.log('Initialized AES');

const plaintext = '4d455353414745454e43525054494f4e';
const cyphertext = aes.encrypt(plaintext);
console.log('Plaintext: ' + plaintext);
console.log('Encrypted: ' + cyphertext);
// cyphertext = '4ff5a7cecf03bf86071577686c6f8f9e'
/* 
Verified with https://www.cryptool.org/en/cto/aes-step-by-step
Configuration: AES-128, ECB
*/

const decrypted = aes.decrypt(cyphertext);
console.log('Decrypted: ' + decrypted);
