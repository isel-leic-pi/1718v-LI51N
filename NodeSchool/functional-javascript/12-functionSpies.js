
function Spy(target, method) {
    let result = { count: 0 }
    const subject = target[method]
    target[method] = function (...args) { result.count += 1; return subject.call(this, ...args) }
    return result
}

module.exports = Spy