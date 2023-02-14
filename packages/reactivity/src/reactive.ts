/*
 * @Date: 2023-02-13 14:35:04
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-14 12:30:27
 * @FilePath: /lx_miniVue3/packages/reactivity/src/reactive.ts
 * @description:
 */

import { mutableHandles } from './baseHandler'
import { isObject } from '@vue/shared'
// 缓存响应式过的数据
export const reactiveMap = new WeakMap<object, any>()

// 暴露出 reactive 方法，文件的入口函数
export function reactive(target: Object) {
  return createReactiveObject(target, mutableHandles, reactiveMap)
}

function createReactiveObject(
  target: Object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Object, any>
) {
  // 读取缓存
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 创建proxy类型
  let proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  //   返回proxy代理对象
  return proxy
}

export const toReactive = <T extends unknown>(value: T): T => {
  return isObject(value) ? reactive(value as Object) : value
}
