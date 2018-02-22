function repeat(operation, num) {
    return function() {
        if (num <= 0) return
        operation()
        return repeat(operation, --num)
    }
}

function trampoline(fn) {
    while(fn && typeof fn === 'function') {
        fn = fn()
    }
}

module.exports = function(operation, num) {
    return trampoline(() => repeat(operation, num))
}


// A nice article explaining trampolines =)
// http://raganwald.com/2013/03/28/trampolines-in-javascript.html