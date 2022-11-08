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
    createApp: () => createApp
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
  var extend = (origin, target) => {
    return __spreadValues(__spreadValues({}, origin), target);
  };

  // packages/runtime-core/src/createAppApi.ts
  var createAppApi = (render) => {
    return function createApp2(rootComponent, rootProps = {}) {
      const app = {
        mount(container) {
          let vnode = {};
          render(vnode, container);
        }
      };
      return app;
    };
  };

  // packages/runtime-core/src/renderer.ts
  var createRenderer = (renderOptions2) => {
    const render = (vnode, container) => {
    };
    return {
      createApp: createAppApi(render)
    };
  };

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
