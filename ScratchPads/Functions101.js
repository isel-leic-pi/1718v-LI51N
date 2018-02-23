
function sayHiNotAFunction() {
    console.log('Hi')
}

function addIsARealFunction(opr1, opr2) {
    return opr1 + opr2
}

let operation = addIsARealFunction
operation.someProperty = "SLB, O MAIOR!!!"
console.log(operation)
console.log(typeof(operation))
console.log(operation["someProperty"])

let anotherOperation = function (opr1, opr2) {
    return opr1 * opr2
}

let yetAnotherOperation = (opr1, opr2) => opr1 - opr2
yetAnotherOperation.someProperty = "SLB, O MAIOR!!!"


console.log(`addIsARealFunction(4, 6) is equal to ${addIsARealFunction(4, 6)}`)
console.log(operation(10, 32))
