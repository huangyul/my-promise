// 新建 MyPromise类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 执行resolve和reject
    executor(this.resolve, this.reject)
  }

  // 为什么要使用箭头函数
  // 使用箭头函数可以让函数的this指向当前实例
  // 解决后的状态
  resolve = () => {}

  // 拒绝后的状态
  reject = () => {}
}
