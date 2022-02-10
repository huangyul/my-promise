const MyPromise = require('./MyPromise')

const p = new MyPromise((resolve, reject) => {
  resolve('success')
  // throw new Error('执行器错误')
})

p.then().then().then().then(console.log)
