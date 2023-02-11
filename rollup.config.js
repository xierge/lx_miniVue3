/*
 * @Date: 2023-02-11 21:54:31
 * @LastEditors: lipengxi 2899952565@qq.com
 * @LastEditTime: 2023-02-11 22:09:30
 * @FilePath: /lx_miniVue3/rollup.config.js
 * @description:
 */

import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
export default [
  {
    input: 'packages/vue/src/index.ts',
    output: [
      {
        sourcemap: true,
        file: './packages/vue/dist/vue.js',
        format: 'iife',
        name: 'Vue'
      }
    ],
    plugins: [
      typescript({
        sourceMap: true
      }),
      nodeResolve(),
      commonjs()
    ]
  }
]
