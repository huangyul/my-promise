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

  // 存储成功回调函数
  // onFulfilledCallback = null
  onFulfilledcallbacks = []

  // 存储失败回调函数
  // onRejectedCallback = null
  onRejectedCallbacks = []

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

      // 判断成功回调是否存在，如果存在就调用
      // this.onFulfilledCallback && this.onFulfilledCallback(value)
      while (this.onFulfilledcallbacks.length) {
        // Array.shift() 取出第一个元素，然后（）调用
        this.onFulfilledcallbacks.shift()(this.value)
      }
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

      // 判断失败回调是否存在，如果存在就调用
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    // 为了链式调用，这里直接创建一个promise实例，然后return出去
    return new MyPromise((resolve, reject) => {
      // 判断状态
      if (this.status === FULFILLED) {
        // 如果状态为解决，则放回值
        const x = onFulfilled(this.value)

        // 统一集中处理
        resolvePromise(x, resolve, reject)
      } else if (this.status === REJECTED) {
        // 如果状态为拒绝，则返回拒绝的原因
        onRejected(this.reason)
      } else if (this.status === PENDING) {
        // 因为不知道后面状态的变化情况，所以要将成功回调和失败回调存储起来
        // 等待执行成功失败函数的时候在传递
        this.onFulfilledcallbacks.push(onFulfilled)
        this.onRejectedCallbacks.push(onRejected)
      }
    })
  }
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是MyPromise实例对象
  if (x instanceof MyPromise) {
    // 如果是promise对象，则调用then
    // 执行x，调用then方法，将promise的状态变为fulfilled或者rejected
    x.then(resolve, reject)
  } else {
    // 普通值
    resolve(x)
  }
}

module.exports = MyPromise
