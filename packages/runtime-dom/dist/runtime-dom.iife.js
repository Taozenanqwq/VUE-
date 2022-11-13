var VueRuntimeDom = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b ||= {})
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
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

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    createApp: () => createApp,
    createRenderer: () => createRenderer,
    h: () => h
  });

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement: (tagName) => document.createElement(tagName),
    remove: (child) => {
      let parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    insert: (child, parent, anchor) => {
      parent.insertChild(child, anchor);
    },
    querySelector: (selector) => document.querySelector(selector),
    setElementText: (el, text) => el.textContent = text,
    createText: (text) => document.createTextNode(text),
    setText: (node, text) => node.nodeValue = text
  };

  // packages/runtime-dom/src/modules/attr.ts
  var patchAttr = (el, key, val) => {
    if (!val) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, val);
    }
  };

  // packages/runtime-dom/src/modules/class.ts
  var patchClass = (el, newVal) => {
    if (newVal == null) {
      newVal = "";
    }
    el.className = newVal;
  };

  // packages/runtime-dom/src/modules/style.ts
  var patchStyle = (el, preStyle, nextStyle) => {
    let style = el.style;
    if (!nextStyle) {
      el.removeAttribute("style");
    } else {
      if (preStyle) {
        for (let key of preStyle) {
          if (nextStyle[key] === null) {
            style[key] = "";
          }
        }
      }
      for (let key of nextStyle) {
        style[key] = nextStyle[key];
      }
    }
  };

  // packages/runtime-dom/src/modules/events.ts
  function createInvoker(value) {
    const invoker = (e) => {
      invoker.value(e);
    };
    invoker.value = value;
    return invoker;
  }
  var patchEvents = (el, key, event) => {
    const invokers = el._vei || (el._vei = {});
    const exists = invokers[key];
    if (event && exists) {
      exists.value = event;
    } else {
      const eventName = key.slice(2).toLowercase();
      if (event) {
        let invoker = invokers[eventName] = createInvoker(event);
        el.addEventListener(eventName, invoker);
      } else if (exists) {
        el.removeEventListener(eventName, exists);
        invokers[eventName] = void 0;
      }
    }
  };

  // packages/runtime-dom/src/patchProps.ts
  var patchProps = (el, key, preVal, nextVal) => {
    switch (key) {
      case "class":
        patchClass(el, nextVal);
        break;
      case "style":
        patchStyle(el, preVal, nextVal);
        break;
      default:
        if (/^on[^a-z]/.test(key)) {
          patchEvents(el, key, nextVal);
        } else {
          patchAttr(el, key, nextVal);
        }
    }
  };

  // packages/shared/src/index.ts
  var isObject = (obj) => typeof obj === "object" && obj !== null;
  var isFunction = (obj) => typeof obj === "function";
  var extend = (origin, target) => {
    return __spreadValues(__spreadValues({}, origin), target);
  };
  var isString = (str) => {
    return typeof str === "string";
  };
  var isArray = (obj) => {
    return Object.prototype.toString.call(obj, null).slice(8, -1) === "Array";
  };
  var hasOwn = (target, prop) => {
    return target.hasOwnProperty(prop);
  };

  // packages/runtime-core/src/vnode.ts
  var createVNode = (type, props, children = null) => {
    const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : 0;
    const vnode = {
      _v_isVNode: true,
      type,
      props,
      key: props && props.key,
      children,
      el: null,
      shapeFlag
    };
    normalizeChildren(vnode, children);
    return vnode;
  };
  function normalizeChildren(vnode, children) {
    let type = 0;
    if (children === null) {
    } else if (isArray(children)) {
      type = 16 /* ARRAY_CHILDREN */;
    } else {
      type = 8 /* TEXT_CHILDREN */;
    }
    type = type | vnode.shapeFlag;
    return type;
  }
  var isVnode = (target) => {
    return target._v_isVNode;
  };

  // packages/runtime-core/src/createAppApi.ts
  var createAppApi = (render) => {
    return function createApp2(rootComponent, rootProps = {}) {
      const app = {
        _props: rootProps,
        _component: rootComponent,
        _container: null,
        mount(container) {
          let vnode = createVNode(rootComponent, rootProps);
          render(vnode, container);
        }
      };
      return app;
    };
  };

  // packages/runtime-core/src/componentPublicInstace.ts
  var publicInstanceProxyHandlers = {
    get(target, key, reciever) {
      const { _: instance } = target;
      const { setupState, props, data } = instance;
      if (key[0] == "$")
        return;
      if (hasOwn(setupState, key)) {
        return setupState[key];
      } else if (hasOwn(props, key)) {
        return props[key];
      } else if (hasOwn(data, key)) {
        return data[key];
      } else {
        return void 0;
      }
    },
    set(target, key, value, receiver) {
      const { _: instance } = target;
      const { setupState, props, data } = instance;
      if (hasOwn(setupState, key)) {
        setupState[key] = value;
      } else if (hasOwn(props, key)) {
        props[key] = value;
      } else if (hasOwn(data, key)) {
        data[key] = value;
      }
      return true;
    }
  };

  // packages/runtime-core/src/component.ts
  var createComponentInstance = (vnode) => {
    const instance = {
      vnode,
      type: vnode.type,
      props: {},
      attrs: {},
      slots: {},
      setupState: {},
      render: null,
      ctx: {},
      isMounted: false
    };
    instance.ctx = { _: instance };
    return instance;
  };
  var setupComponent = (instance) => {
    const { props, children } = instance.vnode;
    instance.props = props;
    instance.children = children;
    if (instance.vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
      setupStatefulComponent(instance);
    }
  };
  var setupStatefulComponent = (instance) => {
    instance.proxy = new Proxy(instance.ctx, publicInstanceProxyHandlers);
    const component = instance.type;
    const { setup, render } = component;
    if (setup) {
      const setupContext = createContext(instance);
      const setupResult = setup(instance.props, setupContext);
      handleSetupResult(instance, setupResult);
    } else {
      finishComponentSetup(instance);
    }
  };
  var handleSetupResult = (instance, setupResult) => {
    if (isFunction(setupResult)) {
      instance.render = setupResult;
    } else if (isObject(setupResult)) {
      instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
  };
  var finishComponentSetup = (instance) => {
    let Component = instance.type;
    if (!instance.render) {
      if (!Component.render && Component.template) {
        console.log("\u7F16\u8BD1\u6A21\u677F");
      }
    }
  };
  var createContext = (instance) => {
    return {
      attrs: instance.attrs,
      slots: instance.slots,
      emit: () => {
      },
      expose: () => {
      }
    };
  };

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
  function cleanupEffects(activeEffect2) {
    const { deps } = activeEffect2;
    for (let key of deps) {
      key.delete(activeEffect2);
    }
    activeEffect2.deps = [];
  }

  // packages/runtime-core/src/renderer.ts
  var createRenderer = (renderOptions2) => {
    const setupRenderEffect = (instance, container) => {
      instance.update = effect(function componentEffect() {
        if (!instance.isMounted) {
          const instanceToUse = instance.proxy;
          const subTree = instance.subTree = instance.render.call(
            instanceToUse,
            instanceToUse
          );
          patch(null, subTree, container);
          instance.isMounted = true;
        } else {
        }
      });
    };
    const mountComponent = (initialVnode, container) => {
      const instance = initialVnode.component = createComponentInstance(initialVnode);
      setupComponent(instance);
      setupRenderEffect(instance, container);
    };
    const processComponent = (n1, n2, container) => {
      if (n1 == null) {
        mountComponent(n2, container);
      } else {
      }
    };
    const patch = (n1, n2, container) => {
      const { shapeFlag } = n2;
      if (shapeFlag & 1 /* ELEMENT */) {
        console.log("patch \u5143\u7D20");
      } else if (shapeFlag & 4 /* STATEFUL_COMPONENT */) {
        processComponent(n1, n2, container);
      }
    };
    const render = (vnode, container) => {
      patch(null, vnode, container);
    };
    return {
      createApp: createAppApi(render)
    };
  };

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l == 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVnode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVnode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = extend({ patchProps }, nodeOps);
  function createApp(rootComponent, rootProps = {}) {
    const app = createRenderer(renderOptions).createApp(rootComponent, rootProps);
    const { mount } = app;
    app.mount = (container) => {
      container = document.querySelector(container);
      container.innerHTML = "";
      mount(container);
    };
    return app;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.iife.js.map
