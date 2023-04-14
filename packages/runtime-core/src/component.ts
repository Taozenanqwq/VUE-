import { ShapeFlags } from './shapeFlag'
import { publicInstanceProxyHandlers } from './componentPublicInstace'
import { isFunction, isObject } from '@vue/shared'
import { compileToRender } from '@vue/compile-core'
import { createVNode, Text } from './vnode'
import { debug } from 'console'
export const createComponentInstance = (vnode) => {
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
  }
  instance.ctx = { _: instance }
  return instance
}
export const setupComponent = (instance) => {
  const { props, children } = instance.vnode
  instance.props = props
  instance.children = children
  if (instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    /*  有状态的组件    */
    setupStatefulComponent(instance)
  }
}
const setupStatefulComponent = (instance) => {
  instance.proxy = new Proxy(instance.ctx, publicInstanceProxyHandlers)
  const component = instance.type
  const { setup, render } = component
  if (setup) {
    const setupContext = createContext(instance)
    const setupResult = setup(instance.props, setupContext)
    handleSetupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance)
  }
}
const handleSetupResult = (instance, setupResult) => {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  } else if (isObject(setupResult)) {
    console.log(setupResult)
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}
const finishComponentSetup = (instance) => {
  let Component = instance.type
  if (!instance.render) {
    if (!Component.render && Component.template) {
      const render = compileToRender(Component.template)
      instance.render = render.bind(
        instance.setupState,
        (type, props, children) => createVNode(type, props, children),
        (text) => text,
        (s) => {
          return isObject(s) ? JSON.stringify(s) : s
        }
      )
    }
  }
}

const createContext = (instance) => {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {}
  }
}
