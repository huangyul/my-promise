const MyPromise = require('./MyPromise')
const p = new MyPromise((resolve, reject) => {
  resolve('success')
  reject('err')
})

p.then(
  (value) => console.log(value),
  (err) => console.log(err)
)
