// src: https://www.geeksforgeeks.org/node-js-fs-copyfile-function/
// Function to get filenames in directory
function getFilenames(src, dst) {
    const fs = require('fs');
    var files1 = [];
    var files2 = [];
    fs.readdirSync(__dirname + src).forEach(file => {
        var temp1 = __dirname + src + file;
        var temp2 = __dirname + dst + file;
        files1.push(temp1);
        files2.push(temp2);
        // console.log(temp1);
        // console.log(temp2);
    });
    var files = [files1, files2];
    return files;
}

function copyFiles(src, dst) {
    const fs = require('fs');
    const files = getFilenames(src, dst);
    const files1 = files[0];
    const files2 = files[1];
    for (let i = 0; i < files1.length; i++) {
        fs.copyFile(files1[i], files2[i], (err) => {
            if (err) {
                console.log("Error Found:", err);
            }
            else {
                console.log('Copied successfully! ' + files1[i]);
            }
        });
    }
}

// move all files
let path1 = "/webpage/";
let path2 = "/public/";
copyFiles(path1, path2);

// check files