// 定义三个状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 新建 MyPromise类
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 执行resolve和reject
    executor(this.resolve, this.reject)
  }

  // 存储初始状态为pending
  status = PENDING

  // 成功之后的值
  value = null

  // 失败后的原因
  reason = null

  // 为什么要使用箭头函数
  // 使用箭头函数可以让函数的this指向当前实例
  // 解决后的状态
  resolve = (value) => {
    // 只有状态为等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为解决
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
    }
  }

  // 拒绝后的状态
  reject = (reason) => {
    // 只有状态为等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态修改为拒绝
      this.status = REJECTED
      // 保存拒绝的原因
      this.reason = reason
    }
  }

  then(onFulfilled, onRejected) {
    // 判断状态
    if (this.status === FULFILLED) {
      // 如果状态为解决，则放回值
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      // 如果状态为拒绝，则返回拒绝的原因
      onRejected(this.reason)
    }
  }
}

module.exports = MyPromise
