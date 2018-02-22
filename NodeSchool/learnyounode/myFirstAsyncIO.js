const fs = require('fs')

fs.readFile(process.argv[2], function callback (error, data) {
    if (!error) {
        console.log(data.toString().split('\n').length - 1)
    }
})