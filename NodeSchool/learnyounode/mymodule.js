const fs = require('fs')
const path = require('path')

module.exports = function (dirPath, extension, callback) {
    fs.readdir(dirPath, function (err, list) {
        if (err)
            return callback(err)
            
        const result = list.filter((filename) => path.extname(filename).endsWith(extension))
        callback(null, result)
    })
}