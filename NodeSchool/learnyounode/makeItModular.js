const mymodule = require('./mymodule')

const dirPath = process.argv[2]
const extension = process.argv[3]

mymodule(dirPath, extension, function callback(err, list) {  
    list.forEach((elem) => console.log(elem))
})