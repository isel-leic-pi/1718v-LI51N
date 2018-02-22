const http = require('http')
const fs = require('fs')

const port = process.argv[2]
const filePath = process.argv[3]

const server = http.createServer(function (request, response) {
    var inputDescriptor = fs.statSync(filePath);
    response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Length': inputDescriptor.size
    });

    var inputStream = fs.createReadStream(filePath);
    inputStream.pipe(response);
})

server.listen(port)