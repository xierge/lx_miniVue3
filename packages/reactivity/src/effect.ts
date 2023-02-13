/*
 * @Date: 2023-02-13 15:47:09
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-13 18:41:41
 * @FilePath: /lx_miniVue3/packages/reactivity/src/effect.ts
 * @description: effect函数的 依赖的追踪和触发
 */

import { createDep, Dep } from './dep'
type KeyToDepMap = Map<any, Dep>

// getter插入数据内容 setter时获取数据内容
const targetMap = new WeakMap<any, KeyToDepMap>()

// 追踪收集依赖
export function track(target: object, key: unknown) {
  if (!ativeEffect) return

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}

// dep集合里面追加effect函数
export function trackEffects(dep: Dep) {
  dep.add(ativeEffect!)
}

// 触发依赖
export function trigger(target: object, key: unknown, value: unknown) {
  const dep: Dep | undefined = targetMap.get(target)?.get(key)
  if (!dep) return
  triggerEffects(dep)
}

// 触发dep集合里面所有effect
export function triggerEffects(dep: Dep) {
  const effects = Array.isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

// 执行每一个effect里的函数
export function triggerEffect(effect: ReactiveEfeect) {
  effect.run()
}

// 全局缓存当前的ReactiveEfeect的实例
export let ativeEffect: ReactiveEfeect | undefined

export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEfeect(fn)
  // 第一次初始化直接执行函数
  _effect.run()
}

// ReactiveEfeect 类
export class ReactiveEfeect<T = any> {
  constructor(public fn: () => T) {}
  run() {
    ativeEffect = this
    return this.fn()
  }
}
