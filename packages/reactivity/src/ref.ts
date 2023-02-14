/*
 * @Date: 2023-02-14 12:19:05
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-14 14:32:25
 * @FilePath: /lx_miniVue3/packages/reactivity/src/ref.ts
 * @description: ref实现
 */

import { hasChanged } from './../../shared/src/index'
import { toReactive } from './reactive'
import { Dep } from './dep'
import { trackEffects, activeEffect, triggerEffects } from './effect'
import { createDep } from './dep'

export interface Ref<T = any> {
  value: T
}

// 入口函数
export function ref(value?: unknown) {
  return createRef(value, false)
}

// 创建ref
function createRef(rawValue: unknown, shallow: boolean) {
  // 判断是否是ref类型
  if (isRef(rawValue)) {
    return rawValue
  }

  return new RefImpl(rawValue, shallow)
}

export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

// 判断是否是ref类型
export function trackRefValue(ref: RefImpl<unknown>) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

// RefImpl类
class RefImpl<T> {
  private _value: T
  private _rawValue: T
  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    // 根据是否是复杂数据类型返回value
    this._value = __v_isShallow ? value : toReactive(value)

    // 原始数据
    this._rawValue = value
  }

  // getter方法 value读取的时候触发
  get value() {
    // 收集effect依赖函数
    trackRefValue(this)
    return this._value
  }

  // setter方法 value改变时出发
  set value(val) {
    if (hasChanged(val, this._rawValue)) {
      this._rawValue = val
      this._value = toReactive(val)
      triggerRef(this)
    }
  }
}

// 触发依赖函数
export function triggerRef(ref: RefImpl<unknown>) {
  ref.dep && triggerEffects(ref.dep)
}
