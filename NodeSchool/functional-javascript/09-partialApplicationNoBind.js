function logger(namespace) {
    return function () {
        const args = Array(namespace).concat(Array.from(arguments))
        console.log.apply(console, args)
    }
}

module.exports = logger