const net = require('net')

function now() {
    const now = new Date()
    function format(value) {
        return `${value < 10 ? '0' : ''}${value.toString()}`
    }
    const day = `${now.getFullYear()}-${format(now.getMonth()+1)}-${format(now.getDate())}`
    const hour = `${format(now.getHours())}:${format(now.getMinutes())}`
    return `${day} ${hour}`
}

const port = process.argv[2]
const server = net.createServer(function (socket) {
    socket.write(now()+'\n')
    socket.end()
})

server.listen(port)