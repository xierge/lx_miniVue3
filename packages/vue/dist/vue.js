var Vue = (function (exports) {
  'use strict'

  /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

  function __values(o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0
    if (m) return m.call(o)
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0
          return { value: o && o[i++], done: !o }
        }
      }
    throw new TypeError(
      s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
    )
  }

  function __read(o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator]
    if (!m) return o
    var i = m.call(o),
      r,
      ar = [],
      e
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value)
    } catch (error) {
      e = { error: error }
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i)
      } finally {
        if (e) throw e.error
      }
    }
    return ar
  }

  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i)
          ar[i] = from[i]
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from))
  }

  // ??????ReactiveEfeect???????????????
  var createDep = function (effects) {
    var dep = new Set(effects)
    return dep
  }

  /*
   * @Date: 2023-02-13 15:47:09
   * @LastEditors: lipengxi 2899952565@qq.com
   * @LastEditTime: 2023-02-17 11:18:05
   * @FilePath: /lx_miniVue3/packages/reactivity/src/effect.ts
   * @description: effect????????? ????????????????????????
   */
  // getter?????????????????? setter?????????????????????
  var targetMap = new WeakMap()
  // ??????????????????
  function track(target, key) {
    if (!activeEffect) return
    var depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    var dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = createDep()))
    }
    trackEffects(dep)
  }
  // dep??????????????????effect??????
  function trackEffects(dep) {
    dep.add(activeEffect)
  }
  // ????????????
  function trigger(target, key, value) {
    var _a
    var dep =
      (_a = targetMap.get(target)) === null || _a === void 0
        ? void 0
        : _a.get(key)
    if (!dep) return
    triggerEffects(dep)
  }
  // ??????dep??????????????????effect
  function triggerEffects(dep) {
    var e_1, _a, e_2, _b
    var effects = Array.isArray(dep)
      ? dep
      : __spreadArray([], __read(dep), false)
    try {
      for (
        var effects_1 = __values(effects), effects_1_1 = effects_1.next();
        !effects_1_1.done;
        effects_1_1 = effects_1.next()
      ) {
        var effect_1 = effects_1_1.value
        if (effect_1.computed) {
          triggerEffect(effect_1)
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 }
    } finally {
      try {
        if (effects_1_1 && !effects_1_1.done && (_a = effects_1.return))
          _a.call(effects_1)
      } finally {
        if (e_1) throw e_1.error
      }
    }
    try {
      for (
        var effects_2 = __values(effects), effects_2_1 = effects_2.next();
        !effects_2_1.done;
        effects_2_1 = effects_2.next()
      ) {
        var effect_2 = effects_2_1.value
        if (!effect_2.computed) {
          triggerEffect(effect_2)
        }
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 }
    } finally {
      try {
        if (effects_2_1 && !effects_2_1.done && (_b = effects_2.return))
          _b.call(effects_2)
      } finally {
        if (e_2) throw e_2.error
      }
    }
  }
  // ???????????????effect????????????
  function triggerEffect(effect) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
  // ?????????????????????ReactiveEfeect?????????
  var activeEffect
  function effect(fn) {
    var _effect = new ReactiveEfeect(fn)
    // ????????????????????????????????????
    _effect.run()
  }
  // ReactiveEfeect ???
  var ReactiveEfeect = /** @class */ (function () {
    function ReactiveEfeect(fn, scheduler) {
      this.fn = fn
      this.scheduler = scheduler
    }
    ReactiveEfeect.prototype.run = function () {
      activeEffect = this
      return this.fn()
    }
    return ReactiveEfeect
  })()

  /*
   * @Date: 2023-02-13 14:43:54
   * @LastEditors: lipengxi 2899952565@qq.com
   * @LastEditTime: 2023-02-17 11:19:16
   * @FilePath: /lx_miniVue3/packages/reactivity/src/baseHandler.ts
   * @description: new Proxy() ??????setter???getter????????????
   */
  var get = createGetter()
  var set = createSetter()
  var mutableHandles = {
    get: get,
    set: set
  }
  // ??????proxy???getter
  function createGetter() {
    return function get(target, key, receiver) {
      var res = Reflect.get(target, key, receiver)
      // ????????????
      track(target, key)
      return res
    }
  }
  // ??????proxy???setter
  function createSetter() {
    return function set(target, key, value, receiver) {
      var result = Reflect.set(target, key, value, receiver)
      // ????????????
      trigger(target, key)
      return result
    }
  }

  /*
   * @Date: 2023-02-11 21:48:37
   * @LastEditors: lipengxi 2899952565@qq.com
   * @LastEditTime: 2023-02-14 15:59:36
   * @FilePath: /lx_miniVue3/packages/shared/src/index.ts
   * @description: ????????????
   */
  var isObject = function (value) {
    return value !== null && typeof value === 'object'
  }
  var hasChanged = function (value, oldValue) {
    return !Object.is(value, oldValue)
  }
  var isFunction = function (val) {
    return typeof val === 'function'
  }

  /*
   * @Date: 2023-02-13 14:35:04
   * @LastEditors: lipengxi 2899952565@qq.com
   * @LastEditTime: 2023-02-15 20:50:57
   * @FilePath: /lx_miniVue3/packages/reactivity/src/reactive.ts
   * @description:
   */
  // ???????????????????????????
  var reactiveMap = new WeakMap()
  // ????????? reactive ??????????????????????????????
  function reactive(target) {
    return createReactiveObject(target, mutableHandles, reactiveMap)
  }
  function createReactiveObject(target, baseHandlers, proxyMap) {
    // ????????????
    var existingProxy = proxyMap.get(target)
    if (existingProxy) {
      return existingProxy
    }
    // ??????proxy??????
    var proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy)
    //   ??????proxy????????????
    return proxy
  }
  var toReactive = function (value) {
    return isObject(value) ? reactive(value) : value
  }

  /*
   * @Date: 2023-02-14 12:19:05
   * @LastEditors: lipengxi 2899952565@qq.com
   * @LastEditTime: 2023-02-17 10:49:45
   * @FilePath: /lx_miniVue3/packages/reactivity/src/ref.ts
   * @description: ref??????
   */
  // ????????????
  function ref(value) {
    return createRef(value, false)
  }
  // ??????ref
  function createRef(rawValue, shallow) {
    // ???????????????ref??????
    if (isRef(rawValue)) {
      return rawValue
    }
    return new RefImpl(rawValue, shallow)
  }
  function isRef(r) {
    return !!(r && r.__v_isRef === true)
  }
  // RefImpl???
  var RefImpl = /** @class */ (function () {
    function RefImpl(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow
      this.dep = undefined
      this.__v_isRef = true
      // ???????????????????????????????????????value
      this._value = __v_isShallow ? value : toReactive(value)
      // ????????????
      this._rawValue = value
    }
    Object.defineProperty(RefImpl.prototype, 'value', {
      // getter?????? value?????????????????????
      get: function () {
        // ??????effect????????????
        trackRefValue(this)
        return this._value
      },
      // setter?????? value???????????????
      set: function (val) {
        if (hasChanged(val, this._rawValue)) {
          this._rawValue = val
          this._value = toReactive(val)
          triggerRefValue(this)
        }
      },
      enumerable: false,
      configurable: true
    })
    return RefImpl
  })()
  // ???????????? ???????????????ref??????
  function trackRefValue(ref) {
    if (activeEffect) {
      trackEffects(ref.dep || (ref.dep = createDep()))
    }
  }
  // ??????????????????
  function triggerRefValue(ref) {
    ref.dep && triggerEffects(ref.dep)
  }

  /*
   * @Date: 2023-02-14 15:57:26
   * @LastEditors: lipengxi 2899952565@qq.com
   * @LastEditTime: 2023-02-17 11:10:27
   * @FilePath: /lx_miniVue3/packages/reactivity/src/computed.ts
   * @description:
   */
  function computed(getterOrOptions) {
    var getter
    var onlyGetter = isFunction(getterOrOptions)
    if (onlyGetter) {
      getter = getterOrOptions
    }
    var cRef = new ComputedRefImpl(getter)
    return cRef
  }
  var ComputedRefImpl = /** @class */ (function () {
    function ComputedRefImpl(getter) {
      var _this = this
      this._dirty = true
      this.__v_isRef = true
      this.effect = new ReactiveEfeect(getter, function () {
        if (!_this._dirty) {
          _this._dirty = true
          triggerRefValue(_this)
        }
      })
      this.effect.computed = this
    }
    Object.defineProperty(ComputedRefImpl.prototype, 'value', {
      get: function () {
        trackRefValue(this)
        if (this._dirty) {
          this._dirty = false
          this._value = this.effect.run()
        }
        return this._value
      },
      enumerable: false,
      configurable: true
    })
    return ComputedRefImpl
  })()

  exports.computed = computed
  exports.effect = effect
  exports.reactive = reactive
  exports.ref = ref

  Object.defineProperty(exports, '__esModule', { value: true })

  return exports
})({})
//# sourceMappingURL=vue.js.map
