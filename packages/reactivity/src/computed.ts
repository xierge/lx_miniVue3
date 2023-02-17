/*
 * @Date: 2023-02-14 15:57:26
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-17 11:10:27
 * @FilePath: /lx_miniVue3/packages/reactivity/src/computed.ts
 * @description:
 */

import { ReactiveEfeect } from './effect'
import { Dep } from './dep'
import { isFunction } from '@vue/shared'
import { trackRefValue, triggerRefValue } from './ref'
export function computed(getterOrOptions) {
  let getter
  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
  }
  const cRef = new ComputedRefImpl(getter)
  return cRef
}

export class ComputedRefImpl<T> {
  public dep?: Dep
  private _value!: T
  public _dirty: boolean = true
  public readonly effect: ReactiveEfeect<T>
  public readonly __v_isRef = true
  constructor(getter) {
    this.effect = new ReactiveEfeect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
  }

  get value() {
    trackRefValue(this)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}
