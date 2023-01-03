// move all files
let path1 = "./webpage/";
let path2 = "./public/";


var myObject = new ActiveXObject("Scripting.FileSystemObject");
var myFolder = myObject.GetFolder(path1);

myFolder.Copy(path2, false);


// check files