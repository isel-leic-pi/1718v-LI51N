'use strict'

const values = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]

values.someProp = 'SLB'

function isEven(value) {
    return value % 2 == 0
}

console.log(values)
const result = values.filter(isEven)
console.log(result)
