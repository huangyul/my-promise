const MyPromise = require('./MyPromise')
const p = new MyPromise((resolve, reject) => {
  resolve('success')
})

p.then((value) => {
  console.log(1)
  return value
}).then((value) => {
  console.log(2)
  console.log(value)
})
