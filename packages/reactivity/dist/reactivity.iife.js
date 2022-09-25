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
    constructor(fn) {
      this.fn = fn;
      this.active = true;
      this.parent = null;
      this.deps = [];
      this.run();
    }
    run() {
      if (!this.active)
        return this.fn();
      try {
        this.parent = activeEffect;
        activeEffect = this;
        return this.fn();
      } finally {
        activeEffect = this.parent;
        this.parent = null;
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
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
    const dep = depsMap.get(key);
    if (!dep)
      return;
    dep && dep.forEach((effect2) => {
      if (effect2 !== activeEffect)
        effect2.run();
    });
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
