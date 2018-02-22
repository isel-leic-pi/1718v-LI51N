const http = require('http')
const fs = require('fs')
const url = require('url')

const server = http.createServer(function (request, response) {
    const parsedUrl = url.parse(request.url, true)
    const time = new Date(parsedUrl.query['iso'])
    let result = undefined
    switch (parsedUrl.pathname) {
        case '/api/unixtime':
            result = JSON.stringify({ "unixtime": time.getTime() })
            break
        case '/api/parsetime':
            result = JSON.stringify({
                'hour': time.getHours(),
                'minute': time.getMinutes(),
                'second': time.getSeconds()
            })
            break
    }

    response.writeHead(result ? 200 : 404, { 'Content-Type': 'application/json' })
    response.end(result)
})

const port = process.argv[2]
server.listen(port)