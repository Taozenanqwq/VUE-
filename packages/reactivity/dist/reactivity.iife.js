var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    computed: () => computed,
    effect: () => effect,
    reactive: () => reactive,
    ref: () => ref,
    watch: () => watch
  });

  // packages/reactivity/src/effect.ts
  var activeEffect;
  var ReactiveEffect = class {
    constructor(fn, schedular) {
      this.fn = fn;
      this.schedular = schedular;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active)
        return this.fn();
      try {
        this.parent = activeEffect;
        activeEffect = this;
        cleanupEffects(this);
        return this.fn();
      } finally {
        activeEffect = this.parent;
        this.parent = null;
      }
    }
    stop() {
      if (this.active)
        this.active = false;
      cleanupEffects(this);
    }
  };
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.schedular);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function trackEffect(target, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    trackDepEffect(dep);
  }
  function trackDepEffect(dep) {
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
  function triggerEffect(target, key, value) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    let dep = depsMap.get(key);
    if (!dep)
      return;
    triggerDepEffect(dep);
  }
  function triggerDepEffect(dep) {
    dep = new Set(dep);
    dep && dep.forEach((effect3) => {
      if (effect3 !== activeEffect)
        effect3.schedular ? effect3.schedular() : effect3.run();
    });
  }
  function cleanupEffects(activeEffect2) {
    const { deps } = activeEffect2;
    for (let key of deps) {
      key.delete(activeEffect2);
    }
    activeEffect2.deps = [];
  }

  // packages/shared/src/index.ts
  var isObject = (obj) => typeof obj === "object" && obj !== null;
  var isFunction = (obj) => typeof obj === "function";

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function isReactive(obj) {
    if (isObject(obj) && obj["__v_isReactive" /* IS_REACTIVE */])
      return true;
    return false;
  }
  function reactive(obj) {
    if (!isObject(obj))
      return obj;
    if (obj["__v_isReactive" /* IS_REACTIVE */])
      return obj;
    if (reactiveMap.has(obj))
      return reactiveMap.get(obj);
    const proxy = new Proxy(obj, {
      get(target, key, receiver) {
        if (key === "__v_isReactive" /* IS_REACTIVE */)
          return true;
        trackEffect(target, key);
        let res = Reflect.get(target, key, receiver);
        if (isObject(res)) {
          return reactive(res);
        }
        return res;
      },
      set(target, key, value, receiver) {
        let oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);
        if (oldValue !== value) {
          triggerEffect(target, key, value);
        }
        return result;
      }
    });
    return proxy;
  }
  function toReactive(val) {
    if (isObject(val)) {
      return reactive(val);
    } else {
      return val;
    }
  }

  // packages/reactivity/src/computed.ts
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.setter = setter;
      this._dirty = true;
      this.__v_isReadonly = true;
      this.__v_isRef = true;
      this.dep = /* @__PURE__ */ new Set();
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerDepEffect(this.dep);
        }
      });
    }
    get value() {
      if (activeEffect)
        trackDepEffect(this.dep);
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
    set value(newValue) {
      this.setter(newValue);
    }
  };
  var computed = (config) => {
    let onlyGetter = isFunction(config);
    let getter;
    let setter;
    if (onlyGetter) {
      getter = config;
      setter = () => console.warn("no setter");
    } else {
      getter = config.getter;
      setter = config.setter;
    }
    return new ComputedRefImpl(getter, setter);
  };

  // packages/reactivity/src/watch.ts
  function traversal(source, set) {
    if (!isObject(source))
      return;
    for (let key of source) {
      if (!set.has(key)) {
        traversal(key, set);
        set.add(key);
      }
    }
  }
  function watch(source, cb) {
    let callback;
    let clean;
    if (isReactive(source)) {
      let set = /* @__PURE__ */ new Set();
      source = () => traversal(source, set);
    } else if (!isFunction(source)) {
      return;
    }
    let onCleanup = (fn) => {
      clean = fn;
    };
    let oldValue;
    callback = () => {
      clean && clean();
      let newValue = effect3.run();
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    };
    const effect3 = new ReactiveEffect(source, callback);
    oldValue = effect3.run();
  }

  // packages/reactivity/src/ref.ts
  var RefImpl = class {
    constructor(_rawVal) {
      this._rawVal = _rawVal;
      this.dep = /* @__PURE__ */ new Set();
      this._value = toReactive(_rawVal);
    }
    get value() {
      if (activeEffect) {
        trackDepEffect(this.dep);
      }
      return this._value;
    }
    set value(newVal) {
      if (newVal !== this._rawVal) {
        this._rawVal = newVal;
        this._value = toReactive(newVal);
        triggerDepEffect(this.dep);
      }
    }
  };
  function createRef(value) {
    return new RefImpl(value);
  }
  function ref(val) {
    return createRef(val);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.iife.js.map
