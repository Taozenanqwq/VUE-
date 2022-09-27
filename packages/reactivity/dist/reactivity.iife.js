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
    effect: () => effect,
    reactive: () => reactive
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
    dep = new Set(dep);
    dep && dep.forEach((effect2) => {
      if (effect2 !== activeEffect)
        effect2.schedular ? effect2.schedular() : effect2.run();
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

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
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
        return Reflect.get(target, key, receiver);
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
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.iife.js.map
