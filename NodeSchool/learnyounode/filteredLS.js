const fs = require('fs')
const path = require('path')

const dirPath = process.argv[2]
const extension = process.argv[3]

fs.readdir(dirPath, function callback (err, list) {
    list = err ? [] : list
    list
        .filter((filename) => path.extname(filename).endsWith(extension))
        .forEach((elem) => console.log(elem))
})