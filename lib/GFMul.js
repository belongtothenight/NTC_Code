function gf_mul(x, y) {
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

function xor(x, y) {
    let temp = x ^ y;
    // while (temp > 0xff) {
    //     temp -= 0x100;
    // }
    return temp;
}

function restrictHex(x) {
    while (x > 0xff) {
        x -= 0x100;
    }
    return x;
}

var a = gf_mul(0x0e, 0xee);
var b = gf_mul(0x0b, 0xdf);
var c = gf_mul(0x0d, 0x8f);
var d = gf_mul(0x09, 0xdf);

console.log(a.toString(16));
console.log(b.toString(16));
console.log(c.toString(16));
console.log(d.toString(16));

var axorb = xor(a, b);
var axorbxorc = xor(axorb, c);
var axorbxorcxord = xor(axorbxorc, d);

console.log(axorbxorcxord.toString(16));
axorbxorcxord = restrictHex(axorbxorcxord);
console.log(axorbxorcxord.toString(16));

console.log('');

var a = gf_mul(0x09, 0xee);
var b = gf_mul(0x0e, 0xdf);
var c = gf_mul(0x0b, 0x8f);
var d = gf_mul(0x0d, 0xdf);

console.log(a.toString(16));
console.log(b.toString(16));
console.log(c.toString(16));
console.log(d.toString(16));

var axorb = xor(a, b);
var axorbxorc = xor(axorb, c);
var axorbxorcxord = xor(axorbxorc, d);

console.log(axorbxorcxord.toString(16));
axorbxorcxord = restrictHex(axorbxorcxord);
console.log(axorbxorcxord.toString(16));

console.log('');

var a = gf_mul(0x0d, 0xee);
var b = gf_mul(0x09, 0xdf);
var c = gf_mul(0x0e, 0x8f);
var d = gf_mul(0x0b, 0xdf);

console.log(a.toString(16));
console.log(b.toString(16));
console.log(c.toString(16));
console.log(d.toString(16));

var axorb = xor(a, b);
var axorbxorc = xor(axorb, c);
var axorbxorcxord = xor(axorbxorc, d);

console.log(axorbxorcxord.toString(16));
axorbxorcxord = restrictHex(axorbxorcxord);
console.log(axorbxorcxord.toString(16));

console.log('');

var a = gf_mul(0x0b, 0xee);
var b = gf_mul(0x0d, 0xdf);
var c = gf_mul(0x09, 0x8f);
var d = gf_mul(0x0e, 0xdf);

console.log(a.toString(16));
console.log(b.toString(16));
console.log(c.toString(16));
console.log(d.toString(16));

var axorb = xor(a, b);
var axorbxorc = xor(axorb, c);
var axorbxorcxord = xor(axorbxorc, d);

console.log(axorbxorcxord.toString(16));
axorbxorcxord = restrictHex(axorbxorcxord);
console.log(axorbxorcxord.toString(16));

console.log('');