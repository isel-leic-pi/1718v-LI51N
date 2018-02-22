module.exports = function (str, count = str.length) {
    return str.padEnd(str.length + count, '!')
}