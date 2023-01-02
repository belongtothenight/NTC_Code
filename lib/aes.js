function AES(key, blockSize, iv = false, mode = 'ECB', padding = false, outputType = 'String') {
    /* not fixed yet
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

    this.args = {
        key: key,
        blockSize: blockSize,
        iv: iv,
        mode: mode,
        padding: padding,
        outputType: outputType,
        keysize: 128,
        sbox: [],
        invSbox: [],
        plaintext: '',
        rcon: [],
        round: { 16: 10, 24: 12, 32: 14 },
        mixColumnMatrix: [],
        invMixColumnMatrix: []
    }
    this.print = {
        class: false,
        _init: false,
        _keyExpansion: false,
        _hexStringToByteArray: false,
        _rotBytes: false,
        _xorBytes1: false,
        _xorBytes2: false,
        _addRoundKey: false,
        _subBytes: false,
        _shiftRows: false,
        _mixColumns: false,
        encrypt: false,
        decrypt: false,
    }

    if (this.print.class) {
        console.log('aes class');
        console.log('arg key: ' + this.args.key);
        console.log('arg blockSize: ' + this.args.blockSize);
        console.log('arg iv: ' + this.args.iv);
        console.log('arg mode: ' + this.args.mode);
        console.log('arg padding: ' + this.args.padding);
        console.log('arg outputType: ' + this.args.outputType);
    }
    this.init();
    this.keyExpansion();
};

AES.prototype._hexStringToByteArray = function (input, reArrange = false) {
    /* convert hex string to byte array 
    input('string'): 16 bytes hex string
    */
    let output = [];
    input = input.match(/.{1,2}/g);
    if (reArrange) {
        input = this._reArrangeArray(input);
    }
    for (let i = 0; i < input.length; i++) {
        output.push(parseInt(input[i], 16));
    }
    if (this.print._hexStringToByteArray) {
        console.log('hex string to byte array');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._reArrangeArray = function (input) {
    let reArrangeIndex = {
        0: 0,
        1: 4,
        2: 8,
        3: 12,
        4: 1,
        5: 5,
        6: 9,
        7: 13,
        8: 2,
        9: 6,
        10: 10,
        11: 14,
        12: 3,
        13: 7,
        14: 11,
        15: 15
    }
    let output = [];
    for (let i = 0; i < input.length; i++) {
        output.push(input[reArrangeIndex[i]]);
    }
    return output;
}

AES.prototype._byteArrayToHexArray = function (input) {
    /* convert byte array to hex array
    input(Array): byte array

    To inspect w in encryption or decryption process, use the following code
    for (let i = 0; i < 4; i++) {
        console.log('w[' + i + ']' + this._byteArrayToHexArray(w[i]));
    }
    */
    let output = [];
    for (let i = 0; i < input.length; i++) {
        output.push(input[i].toString(16));
    }
    if (this.print._byteArrayToHexArray) {
        console.log('byte array to hex array');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._rotBytes1 = function (input) {
    /* rotate bytes in array 
    step(Number): number of step to rotate (default: 1, move right 1 step)
    */
    let output = [];
    for (let i = 1; i < 4; i++) {
        output.push(input[i]);
    }
    output.push(input[0])

    if (this.print._rotBytes1) {
        console.log('rot bytes');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._rotBytes2 = function (input, step = 1) {
    /* rotate bytes in array 
    step(Number): number of step to rotate (default: 1, move right 1 step)
    */
    let output = [...input];
    for (let i = 0; i < step; i++) {
        output.unshift(output.pop());
    }

    if (this.print._rotBytes2) {
        console.log('rot bytes');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._xorBytes1 = function (input1, input2) {
    /* xor bytes in array 
    input1(Array): array to xor (only first element will be xor)
    input2(HexNumber): number to xor (0x00 - 0xff)
    */
    let length = input1.length;
    let output = [];
    output.push(input1[0] ^ input2)
    for (let i = 1; i < length; i++) {
        output.push(input1[i])
    }
    if (this.print._xorBytes1) {
        console.log('xor bytes');
        console.log('input1', input1);
        console.log('input2', input2);
        console.log('output', output);
    }
    return output;
};

AES.prototype._xorBytes2 = function (input1, input2) {
    /* xor bytes in array
    input1(Array): array to xor
    input2(Array): array to xor
    */
    let length = input1.length;
    let output = new Array(length);
    for (let i = 0; i < length; i++) {
        output[i] = input1[i] ^ input2[i];
    }
    if (this.print._xorBytes2) {
        console.log('xor bytes');
        console.log('input1', input1);
        console.log('input2', input2);
        console.log('output', output);
    }
    return output;
};

AES.prototype._addRoundKey = function (input, round) {
    let output = [];
    for (let i = 0; i < 4; i++) {
        // console.log('input[i]: ', this._byteArrayToHexArray(input[i]));
        // console.log('key[i + 4 * round]: ', this._byteArrayToHexArray(this.args.key[i + 4 * round]));
        output.push(this._xorBytes2(input[i], this.args.key[i + 4 * round]));
        // console.log('output[i]: ', this._byteArrayToHexArray(output[i]));
    }

    if (this.print._addRoundKey) {
        console.log('add round key');
        for (let i = 0; i < 4; i++) {
            console.log('output[' + i + ']', this._byteArrayToHexArray(input[i]));
        }
        for (let i = 0; i < 4; i++) {
            console.log('output[' + i + ']', this._byteArrayToHexArray(output[i]));
        }
    }
    return output;
};

AES.prototype._subBytes = function (input, sbox = this.args.sbox) {
    let length = input.length;
    let output = new Array(length);
    for (let i = 0; i < length; i++) {
        output[i] = sbox[input[i]];
    }
    if (this.print._subBytes) {
        console.log('sub bytes');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._subBytes2D = function (input, sbox = this.args.sbox) {
    let length = input.length;
    let output = new Array(length);
    for (let i = 0; i < length; i++) {
        output[i] = this._subBytes(input[i], sbox);
    }
    if (this.print._subBytes2D) {
        console.log('sub bytes 2D');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._shiftRows = function (input) {
    let output = [];
    let w = [];
    // convert to column
    for (let i = 0; i < 4; i++) {
        var temp = []
        for (let j = 0; j < 4; j++) {
            temp.push(input[j][i]);
        }
        w.push(temp);
    }
    // shift
    for (let i = 0; i < 4; i++) {
        w[i] = this._rotBytes2(w[i], -i + 4);
    }
    // convert to row
    for (let i = 0; i < 4; i++) {
        var temp = []
        for (let j = 0; j < 4; j++) {
            temp.push(w[j][i]);
        }
        output.push(temp);
    }

    if (this.print._shiftRows) {
        console.log('shift rows');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._invShiftRows = function (input) {
    let output = [];
    let w = [];
    // convert to column
    for (let i = 0; i < 4; i++) {
        var temp = []
        for (let j = 0; j < 4; j++) {
            temp.push(input[j][i]);
        }
        w.push(temp);
    }
    // shift 0.1.2.3
    for (let i = 0; i < 4; i++) {
        w[i] = this._rotBytes2(w[i], i);
    }
    // convert to row
    for (let i = 0; i < 4; i++) {
        var temp = []
        for (let j = 0; j < 4; j++) {
            temp.push(w[j][i]);
        }
        output.push(temp);
    }

    if (this.print._invShiftRows) {
        console.log('inv shift rows');
        console.log('input', input);
        console.log('output', output);
    }
    return output;
};

AES.prototype._GFMul = function (x, y) {
    // https://chat.openai.com/chat
    let result = 0;
    for (let i = 0; i < 8; i++) {
        if ((y & 1) != 0) {
            result ^= x;
        }
        let hiBitSet = (x & 0x80) != 0;
        x <<= 1;
        if (hiBitSet) {
            x ^= 0x1b;  // Modulus for GF(2^8)
        }
        y >>= 1;
    }
    return result;
}

AES.prototype._restrictHex = function (input) {
    while (input > 0xff) {
        input -= 0x100;
    }
    return input;
}

AES.prototype._mixColumns = function (input) {
    let output = [];
    for (let i = 0; i < 4; i++) {
        var temp = [];
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                temp[j] ^= this._GFMul(input[i][k], this.args.mixColumnMatrix[j][k]);
            }
            temp[j] = this._restrictHex(temp[j]);
        }
        output.push(temp);
    }

    if (this.print._mixColumns) {
        console.log('mix columns');
    }
    return output;
};

AES.prototype._invMixColumns = function (input) {
    let output = [];
    for (let i = 0; i < 4; i++) {
        var temp = [];
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                temp[j] ^= this._GFMul(input[i][k], this.args.invMixColumnMatrix[j][k]);
            }
            temp[j] = this._restrictHex(temp[j]);
        }
        output.push(temp);
    }

    if (this.print._invMixColumns) {
        console.log('inv mix columns');
    }
    return output;
};

AES.prototype._hexInputValidation = function (input, size = 16) {
    /* validate input hex string 
    input('string'): hex string
    size('number'): hex string length (default: 16)
    */
    // check key is string
    if (typeof input !== 'string') {
        throw new Error('key must be a string');
    }

    // check string length
    if (input.length !== size * 2) {
        throw new Error('key length must be ' + size * 2);
    }

    // check key is hex string
    var regex = /[0-9a-fA-F]{16}/g;
    if (input.match(regex) !== true) {
    } else {
        throw new Error('key must be a hex string');
    }
};

AES.prototype.init = function () {
    this.args.sbox = [
        // 0     1     2     3     4     5     6     7     8     9     a     b     c     d     e     f
        0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, // 0
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, // 1
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, // 2
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, // 3
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, // 4
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, // 5
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, // 6
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, // 7
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, // 8
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, // 9
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, // a
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, // b
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, // c
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, // d
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, // e
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16  // f
    ];
    this.args.sbox = new Uint8Array(this.args.sbox);
    this.args.invSbox = [
        // 0     1     2     3     4     5     6     7     8     9     a     b     c     d     e     f
        0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, // 0
        0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, // 1
        0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, // 2
        0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, // 3
        0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, // 4
        0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, // 5
        0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, // 6
        0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, // 7
        0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, // 8
        0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, // 9
        0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, // a
        0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, // b
        0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, // c
        0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, // d
        0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, // e
        0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d  // f
    ];
    this.args.invSbox = new Uint8Array(this.args.invSbox);
    this.args.round = this.args.round[this.args.blockSize / 8];
    this.args.mixColumnMatrix = [
        [0x02, 0x03, 0x01, 0x01],
        [0x01, 0x02, 0x03, 0x01],
        [0x01, 0x01, 0x02, 0x03],
        [0x03, 0x01, 0x01, 0x02]
    ];
    this.args.invMixColumnMatrix = [
        [0x0e, 0x0b, 0x0d, 0x09],
        [0x09, 0x0e, 0x0b, 0x0d],
        [0x0d, 0x09, 0x0e, 0x0b],
        [0x0b, 0x0d, 0x09, 0x0e]
    ];
    if (this.print._init) {
        console.log('init');
        console.log('sbox ' + this.args.sbox);
        console.log('invSbox ' + this.args.invSbox);
        console.log('round ' + this.args.round);
    }

};

AES.prototype.keyExpansion = function () {
    /*
    src1: https://www.brainkart.com/article/AES-Key-Expansion_8410/
    src2: https://www.cryptool.org/en/cto/aes-step-by-step
    src3: https://www.youtube.com/watch?v=91x5uT9LRTM (XOR is partially wrong)
    */
    this._hexInputValidation(this.args.key, 16);
    this.args.key = this._hexStringToByteArray(this.args.key);

    // rcon
    this.args.rcon = new Uint8Array([0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]);

    // expand key
    let wCount = (this.args.round + 1) * 4;
    let w = [];
    for (let i = 0; i < 4; i++) {
        // first 4 words are the key / 1st key
        w.push([this.args.key[i * 4], this.args.key[i * 4 + 1], this.args.key[i * 4 + 2], this.args.key[i * 4 + 3]])
    }
    var temp = [];
    for (let i = 4; i < wCount; i++) {
        // rest of the words / rest of the keys
        temp = w[i - 1];
        if (i % 4 === 0) {
            // console.log('temp', this._byteArrayToHexArray(temp));
            // console.log('rotBytes', this._byteArrayToHexArray(this._rotBytes1(temp)));
            // console.log('subBytes', this._byteArrayToHexArray(this._subBytes(this._rotBytes1(temp))));
            // console.log('xorBytes1', this._byteArrayToHexArray(this._xorBytes1(this._subBytes(this._rotBytes1(temp)), this.args.rcon[i / 4 - 1])));
            temp = this._xorBytes1(this._subBytes(this._rotBytes1(temp)), this.args.rcon[i / 4 - 1]);
        }
        w.push(this._xorBytes2(w[i - 4], temp));
    }
    this.args.key = w;

    // // inspect key in hex
    // // console.log('key', this._byteArrayToHexArray(this.args.key));
    // for (let i = 0; i < w.length; i++) {
    //     console.log('w' + i, this._byteArrayToHexArray(w[i]));
    // }

    if (this.print._keyExpansion) {
        console.log('key expansion');
        console.log('rcon', this.args.rcon);
        console.log('key', this.args.key);
    }
};

AES.prototype.encrypt = function (plaintext) {
    /* 
    plaintext: hex string (16 bytes)
    */
    // preprocess plaintext
    let temp;
    let size = this.args.blockSize / 8;
    this._hexInputValidation(plaintext, size);
    temp = this._hexStringToByteArray(plaintext, false);
    let w = [];
    for (let i = 0; i < size / 4; i++) {
        w.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]]);
    }

    // initial round
    w = this._addRoundKey(w, 0);

    // rounds 1 to N-1
    for (let i = 1; i < this.args.round; i++) {
        w = this._subBytes2D(w);
        w = this._shiftRows(w);
        w = this._mixColumns(w);
        w = this._addRoundKey(w, i);
    }

    // final round
    w = this._subBytes2D(w);
    w = this._shiftRows(w);
    w = this._addRoundKey(w, this.args.round);

    // postprocess ciphertext
    let cyphertext = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            cyphertext += w[i][j].toString(16).padStart(2, '0');
        }
    }

    if (this.print.encrypt) {
        console.log('encrypt');
        console.log('plaintext ', plaintext);
        console.log('cyphertext', cyphertext);
    }
    return cyphertext;
};

AES.prototype.decrypt = function (cyphertext) {
    /*
    cyphertext: hex string (16 bytes)
    */
    // preprocess cyphertext
    let temp;
    let size = this.args.blockSize / 8;
    this._hexInputValidation(cyphertext, size);
    temp = this._hexStringToByteArray(cyphertext, false);
    let w = [];
    for (let i = 0; i < size / 4; i++) {
        w.push([temp[i * 4], temp[i * 4 + 1], temp[i * 4 + 2], temp[i * 4 + 3]]);
    }

    // initial round
    w = this._addRoundKey(w, this.args.round);

    // rounds N to 
    for (let i = this.args.round - 1; i > 0; i--) {
        w = this._invShiftRows(w);
        w = this._subBytes2D(w, this.args.invSbox);
        w = this._addRoundKey(w, i);
        w = this._invMixColumns(w);
    }

    // round 0
    w = this._invShiftRows(w);
    w = this._subBytes2D(w, this.args.invSbox);
    w = this._addRoundKey(w, 0);

    // postprocess plaintext
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ progress ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let plaintext = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            plaintext += w[i][j].toString(16).padStart(2, '0');
        }
    }

    if (this.print.decrypt) {
        console.log('decrypt');
        console.log('cyphertext ', cyphertext);
        console.log('plaintext  ', plaintext);
    }
    return plaintext;
};

module.exports.AES = AES;