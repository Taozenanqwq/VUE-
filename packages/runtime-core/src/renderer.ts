import { createAppApi } from './createAppApi'
import { ShapeFlags } from './shapeFlag'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '@vue/reactivity'
export const createRenderer = (renderOptions) => {
  const setupRenderEffect = (instance, container) => {
    instance.update = effect(function componentEffect() {
      if (!instance.isMounted) {
        const instanceToUse = instance.proxy
        const subTree = (instance.subTree = instance.render.call(
          instanceToUse,
          instanceToUse
        ))
        patch(null, subTree, container)
        instance.isMounted = true
      } else {
      }
    })
  }
  /**
   * 将render渲染vnode的方法和构建vnode的过程分开，实现关注点分离
   */
  const mountComponent = (initialVnode, container) => {
    const instance = (initialVnode.component =
      createComponentInstance(initialVnode))
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponent(n2, container)
    } else {
    }
  }
  const patch = (n1, n2, container) => {
    const { shapeFlag } = n2
    if (shapeFlag & ShapeFlags.ELEMENT) {
      console.log('patch 元素')
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n1, n2, container)
    }
  }

  const render = (vnode, container) => {
    patch(null, vnode, container)
  }
  return {
    createApp: createAppApi(render),
  }
}
