function repeat(operation, num) {
    new Array(num).forEach(() => operation())
}

// Recursive solution
function repeatRecursive(operation, num) {
    if (num === 0) return
    operation()
    repeat(operation, --num)
}

// Do not remove the line below
module.exports = repeat