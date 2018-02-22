let food = ['apple', 'pizza', 'pear']
let singleElemArray = food.filter((elem, idx) => idx == 1)
console.log(singleElemArray)

function x(a, b) {
    console.log(a)
    return b
}

console.log(x(4))
