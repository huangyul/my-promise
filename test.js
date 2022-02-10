const MyPromise = require('./MyPromise')
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
})

p.then((value) => {
  console.log(1)
  console.log(value)
})

p.then((value) => {
  console.log(2)
  console.log(value)
})

p.then((value) => {
  console.log(3)
  console.log(value)
})
