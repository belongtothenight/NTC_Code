let aes_enc = function AES_ENC() {
    console.log('aes_enc.js');
    /*
    1. Init
        1. Use input (plaintext) to set plaintext
        2. Use input (key) to set key
        3. Use input (iv) to set iv (initialization vector) if mode is CBC, CFB, OFB, CTR (skipped)
        4. Use input (mode) to set mode (ECB, CBC, CFB, OFB, CTR)
        5. Use input (padding) to set padding (PKCS7, ISO10126, ISO7816, Zeros, ANSIX923, None) (skipped)
        6. Use input (blockSize) to set block size (128, 192, 256)
        7. Use input (outputType) to set output type (Hex, Base64, String) (skipped)
        8. Init keysize=128 ,sbox, invSbox, w, round(10, 12, 14), and state
        9. Split key into 4-byte words with keysize into w
    2. Key expansion
    3. Encryption (rounds)
        1. Add round key
        2. Sub bytes
        3. Shift rows
        4. Mix columns
        5. Normal round
        6. Final round
    */
};

module.exports.aes_enc = aes_enc;