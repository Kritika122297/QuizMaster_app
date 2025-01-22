import fs from "fs";

//sync.....
fs.writeFileSync("./test.txt", "Hello World")

//async
fs.writeFile("./text.txt", "Hello World Async", err => { })