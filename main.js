function writeJSONLocalNode(path, data) {
    var fs = require('fs');
    fs.writeFile(path, JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function writeJSONLocalWeb(path, data) {
    const jsonStr = JSON.stringify(data);
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', path);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function testRun(path, path2) {

    let aeslib = require(path);

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
    // expanded key: 5445414d 53434f52 5049414e 31323334 7686598a 25c516d8 758c5796 44be64a2 dac56391 ff007549 8a8c22df ce32467d fd9f9c1a 029fe953 8813cb8c 46218df1 08c23d40 0a5dd413 824e1f9f c46f926e b08da25c bad0764f 389e69d0 fcf1fbbe 31820cec 8b527aa3 b3cc1373 4f3de8cd 5619b168 dd4bcbcb 6e87d8b8 21ba3075 221d2c95 ff56e75e 91d13fe6 b06b0f93 466bf072 b93d172c 28ec28ca 98872759 67a73b34 de9a2c18 f67604d2 6ef1238b
    /* 
    Verified with https://www.cryptool.org/en/cto/aes-step-by-step
    Configuration: AES-128, ECB
    */

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
    /*
    Verified with https://www.cryptool.org/en/cto/aes-step-by-step
    Configuration: AES-128, ECB
    */
    console.log(aes.args.record);
    writeJSONLocalNode(path2, aes.args.record);
    console.log('Done');
}

let path1 = './lib/aes.js';
let path2 = './lib/aes_showcase.js';
let path3 = './data/1.json';
testRun(path2, path3);