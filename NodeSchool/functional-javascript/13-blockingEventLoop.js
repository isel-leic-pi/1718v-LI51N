
function repeat(operation, num) {
    if (num <= 0) return
    operation()
    const handle = setTimeout(() => { repeat(operation, --num); clearTimeout(handle) })
}

module.exports = repeat