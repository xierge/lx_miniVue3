/*
 * @Date: 2023-02-13 14:43:54
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-17 11:19:16
 * @FilePath: /lx_miniVue3/packages/reactivity/src/baseHandler.ts
 * @description: new Proxy() 时的setter，getter函数定义
 */
import { track, trigger } from './effect'
const get = createGetter()
const set = createSetter()
export const mutableHandles: ProxyHandler<object> = {
  get,
  set
}

// 创建proxy的getter
function createGetter() {
  return function get(target: object, key: string, receiver: object) {
    const res = Reflect.get(target, key, receiver)

    // 依赖收集
    track(target, key)
    return res
  }
}

// 创建proxy的setter
function createSetter() {
  return function set(
    target: object,
    key: string,
    value: unknown,
    receiver: object
  ) {
    const result = Reflect.set(target, key, value, receiver)

    // 触发依赖
    trigger(target, key, value)

    return result
  }
}
