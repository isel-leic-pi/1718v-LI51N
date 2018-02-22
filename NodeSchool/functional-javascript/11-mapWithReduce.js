module.exports = function arrayMap(arr, fn) {
    return arr.reduce((accResult, element, index) => {
        accResult[index] = fn(element)
        return accResult
    }, [])
}