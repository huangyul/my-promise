// 定义三个状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 新建 MyPromise类
class MyPromise {
  constructor(executor) {
    try {
      // executor 是一个执行器，进入会立即执行
      // 执行resolve和reject
      executor(this.resolve, this.reject)
    } catch (err) {
      // 如果有错误立即捕获
      this.reject(err)
    }
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
    // 如果不传，则使用默认函数
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    // 为了链式调用，这里直接创建一个promise实例，然后return出去
    const promise2 = new MyPromise((resolve, reject) => {
      // 判断状态
      if (this.status === FULFILLED) {
        // 创建微任务，要等promise2创建完再统一处理
        queueMicrotask(() => {
          try {
            // 如果状态为解决，则放回值
            const x = onFulfilled(this.value)

            // 统一集中处理
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === REJECTED) {
        // 创建一个微任务等待promise2完成初始化
        queueMicrotask(() => {
          try {
            // 如果状态为拒绝，则返回拒绝的原因
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      } else if (this.status === PENDING) {
        // 因为不知道后面状态的变化情况，所以要将成功回调和失败回调存储起来
        // 等待执行成功失败函数的时候在传递
        this.onFulfilledcallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value)

              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason)

              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    })
    return promise2
  }

  // resolve静态方法
  static resolve(paramter) {
    // 如果传入是MyPromise就直接返回
    if (paramter instanceof MyPromise) {
      return paramter
    }

    // 转成常规方式
    return new MyPromise((resolve) => {
      resolve(paramter)
    })
  }

  // reject静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
}

function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(
      new TypeError('The promise and the return value are the same')
    )
  }

  if (typeof x === 'object' || typeof x === 'function') {
    // x 为 null 直接返回，走后面的逻辑会报错
    if (x === null) {
      return resolve(x)
    }

    let then
    try {
      // 把 x.then 赋值给 then
      then = x.then
    } catch (error) {
      // 如果取 x.then 的值时抛出错误 error ，则以 error 为据因拒绝 promise
      return reject(error)
    }

    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return

        // 否则以 error 为据因拒绝 promise
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x)
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x)
  }
}

MyPromise.deferred = function () {
  var result = {}
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}

module.exports = MyPromise
