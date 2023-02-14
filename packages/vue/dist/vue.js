var Vue = (function (exports) {
    'use strict';

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
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    // 创建ReactiveEfeect实例的集合
    var createDep = function (effects) {
        var dep = new Set(effects);
        return dep;
    };

    /*
     * @Date: 2023-02-13 15:47:09
     * @LastEditors: lipengxi 2899952565@qq.com
     * @LastEditTime: 2023-02-14 12:37:25
     * @FilePath: /lx_miniVue3/packages/reactivity/src/effect.ts
     * @description: effect函数的 依赖的追踪和触发
     */
    // getter插入数据内容 setter时获取数据内容
    var targetMap = new WeakMap();
    // 追踪收集依赖
    function track(target, key) {
        if (!activeEffect)
            return;
        var depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        var dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, (dep = createDep()));
        }
        trackEffects(dep);
    }
    // dep集合里面追加effect函数
    function trackEffects(dep) {
        dep.add(activeEffect);
    }
    // 触发依赖
    function trigger(target, key, value) {
        var _a;
        var dep = (_a = targetMap.get(target)) === null || _a === void 0 ? void 0 : _a.get(key);
        if (!dep)
            return;
        triggerEffects(dep);
    }
    // 触发dep集合里面所有effect
    function triggerEffects(dep) {
        var e_1, _a;
        var effects = Array.isArray(dep) ? dep : __spreadArray([], __read(dep), false);
        try {
            for (var effects_1 = __values(effects), effects_1_1 = effects_1.next(); !effects_1_1.done; effects_1_1 = effects_1.next()) {
                var effect_1 = effects_1_1.value;
                triggerEffect(effect_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (effects_1_1 && !effects_1_1.done && (_a = effects_1.return)) _a.call(effects_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // 执行每一个effect里的函数
    function triggerEffect(effect) {
        effect.run();
    }
    // 全局缓存当前的ReactiveEfeect的实例
    var activeEffect;
    function effect(fn) {
        var _effect = new ReactiveEfeect(fn);
        // 第一次初始化直接执行函数
        _effect.run();
    }
    // ReactiveEfeect 类
    var ReactiveEfeect = /** @class */ (function () {
        function ReactiveEfeect(fn) {
            this.fn = fn;
        }
        ReactiveEfeect.prototype.run = function () {
            activeEffect = this;
            return this.fn();
        };
        return ReactiveEfeect;
    }());

    /*
     * @Date: 2023-02-13 14:43:54
     * @LastEditors: lipengxi 2899952565@qq.com
     * @LastEditTime: 2023-02-13 18:44:35
     * @FilePath: /lx_miniVue3/packages/reactivity/src/baseHandler.ts
     * @description: new Proxy() 时的setter，getter函数定义
     */
    var get = createGetter();
    var set = createSetter();
    var mutableHandles = {
        get: get,
        set: set
    };
    // 创建proxy的getter
    function createGetter() {
        return function get(target, key, receiver) {
            var res = Reflect.get(target, key, receiver);
            // 依赖收集
            track(target, key);
            return res;
        };
    }
    // 创建proxy的setter
    function createSetter() {
        return function set(target, key, value, receiver) {
            var result = Reflect.set(target, key, value, receiver);
            // 触发依赖
            trigger(target, key);
            return result;
        };
    }

    /*
     * @Date: 2023-02-11 21:48:37
     * @LastEditors: lipengxi 2899952565@qq.com
     * @LastEditTime: 2023-02-14 13:41:52
     * @FilePath: /lx_miniVue3/packages/shared/src/index.ts
     * @description: 工具方法
     */
    var isObject = function (value) {
        return value !== null && typeof value === 'object';
    };
    var hasChanged = function (value, oldValue) {
        return !Object.is(value, oldValue);
    };

    /*
     * @Date: 2023-02-13 14:35:04
     * @LastEditors: lipengxi 2899952565@qq.com
     * @LastEditTime: 2023-02-14 12:30:27
     * @FilePath: /lx_miniVue3/packages/reactivity/src/reactive.ts
     * @description:
     */
    // 缓存响应式过的数据
    var reactiveMap = new WeakMap();
    // 暴露出 reactive 方法，文件的入口函数
    function reactive(target) {
        return createReactiveObject(target, mutableHandles, reactiveMap);
    }
    function createReactiveObject(target, baseHandlers, proxyMap) {
        // 读取缓存
        var existingProxy = proxyMap.get(target);
        if (existingProxy) {
            return existingProxy;
        }
        // 创建proxy类型
        var proxy = new Proxy(target, baseHandlers);
        proxyMap.set(target, proxy);
        //   返回proxy代理对象
        return proxy;
    }
    var toReactive = function (value) {
        return isObject(value) ? reactive(value) : value;
    };

    /*
     * @Date: 2023-02-14 12:19:05
     * @LastEditors: lipengxi 2899952565@qq.com
     * @LastEditTime: 2023-02-14 14:32:25
     * @FilePath: /lx_miniVue3/packages/reactivity/src/ref.ts
     * @description: ref实现
     */
    // 入口函数
    function ref(value) {
        return createRef(value, false);
    }
    // 创建ref
    function createRef(rawValue, shallow) {
        // 判断是否是ref类型
        if (isRef(rawValue)) {
            return rawValue;
        }
        return new RefImpl(rawValue, shallow);
    }
    function isRef(r) {
        return !!(r && r.__v_isRef === true);
    }
    // 判断是否是ref类型
    function trackRefValue(ref) {
        if (activeEffect) {
            trackEffects(ref.dep || (ref.dep = createDep()));
        }
    }
    // RefImpl类
    var RefImpl = /** @class */ (function () {
        function RefImpl(value, __v_isShallow) {
            this.__v_isShallow = __v_isShallow;
            this.dep = undefined;
            this.__v_isRef = true;
            // 根据是否是复杂数据类型返回value
            this._value = __v_isShallow ? value : toReactive(value);
            // 原始数据
            this._rawValue = value;
        }
        Object.defineProperty(RefImpl.prototype, "value", {
            // getter方法 value读取的时候触发
            get: function () {
                // 收集effect依赖函数
                trackRefValue(this);
                return this._value;
            },
            // setter方法 value改变时出发
            set: function (val) {
                if (hasChanged(val, this._rawValue)) {
                    this._rawValue = val;
                    this._value = toReactive(val);
                    triggerRef(this);
                }
            },
            enumerable: false,
            configurable: true
        });
        return RefImpl;
    }());
    // 触发依赖函数
    function triggerRef(ref) {
        ref.dep && triggerEffects(ref.dep);
    }

    exports.effect = effect;
    exports.reactive = reactive;
    exports.ref = ref;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=vue.js.map
