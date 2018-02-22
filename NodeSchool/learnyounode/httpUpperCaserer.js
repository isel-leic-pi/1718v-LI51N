const http = require('http')
const fs = require('fs')
const map = require('through2-map')

const port = process.argv[2]
const filePath = process.argv[3]

const server = http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    request.pipe(map((chunk) => chunk.toString().toUpperCase())).pipe(response)
})

server.listen(port)