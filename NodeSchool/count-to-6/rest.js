module.exports = function average(...values) {
    return values.reduce((acc, value) => acc + value, 0) / values.length
}