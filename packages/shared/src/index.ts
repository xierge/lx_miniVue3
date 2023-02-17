/*
 * @Date: 2023-02-11 21:48:37
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-14 15:59:36
 * @FilePath: /lx_miniVue3/packages/shared/src/index.ts
 * @description: 工具方法
 */
export const isString = str => typeof str === 'string'
export const isObject = (value: unknown) =>
  value !== null && typeof value === 'object'

export const hasChanged = (value, oldValue): boolean => {
  return !Object.is(value, oldValue)
}

export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function'
}
