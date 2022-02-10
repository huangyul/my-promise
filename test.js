const MyPromise = require('./MyPromise')
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000)
})

p.then(
  (value) => console.log(value),
  (err) => console.log(err)
)
