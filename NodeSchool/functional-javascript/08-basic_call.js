function duckCount() {
    return Array
            .from(arguments)
            .filter((arg) => Object.prototype.hasOwnProperty.call(arg, 'quack'))
            .length
}

module.exports = duckCount