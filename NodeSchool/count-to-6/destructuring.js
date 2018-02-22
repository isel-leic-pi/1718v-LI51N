let input = process.argv.slice(2)
let userInfo = {};
[, userInfo.username, userInfo.email] = input

console.log(userInfo)