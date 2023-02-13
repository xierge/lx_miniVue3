/*
 * @Date: 2023-02-13 18:17:20
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-13 18:42:53
 * @FilePath: /lx_miniVue3/packages/reactivity/src/dep.ts
 * @description:收集依赖的集合
 */
import { ReactiveEfeect } from './effect'
export type Dep = Set<ReactiveEfeect>

// 创建ReactiveEfeect实例的集合
export const createDep = (effects?: ReactiveEfeect[]) => {
  const dep = new Set<ReactiveEfeect>(effects) as Dep
  return dep
}
