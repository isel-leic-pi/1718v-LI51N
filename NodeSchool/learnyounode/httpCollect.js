const http = require('http')

http.get(process.argv[2], function callback(response) {
    let payload = ''
    response
        .setEncoding('utf8')
        .on('data', (data) => {
            payload = payload.concat(data)
        })
        .on('error', console.error)
        .on('end', () => {
            console.log(payload.length)
            console.log(payload)
        })
}).on('error', console.error)