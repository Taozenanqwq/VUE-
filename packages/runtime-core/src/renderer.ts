import { createAppApi } from './createAppApi'
import { ShapeFlags } from './shapeFlag'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '@vue/reactivity'
import { normalizeVnode, Text } from './vnode'
import { queueJob } from './schedular'
export const createRenderer = (renderOptions) => {
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProps: hostPatchProps,
    createElement: hostCreateElement,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    createText: hostCreateText,
  } = renderOptions
  const setupRenderEffect = (instance, container) => {
    instance.update = effect(
      function componentEffect() {
        if (!instance.isMounted) {
          const instanceToUse = instance.proxy
          const subTree = (instance.subTree = instance.render.call(
            instanceToUse,
            instanceToUse
          ))
          patch(null, subTree, container)
          instance.isMounted = true
        }
      },
      {
        schedular: queueJob,
      }
    )
  }
  /**
   * 将render渲染vnode的方法和构建vnode的过程分开，实现关注点分离
   */

  /** 处理组件 */
  const processComponent = (n1, n2, container) => {
    if (n1 == null) {
      mountComponent(n2, container)
    } else {
    }
  }
  const mountComponent = (initialVnode, container) => {
    const instance = (initialVnode.component =
      createComponentInstance(initialVnode))
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }
  /** 处理元素 */
  const processElement = (n1, n2, container) => {
    if (n1 == null) {
      mountElement(n2, container)
    } else {
    }
  }
  const mountElement = (vnode, container) => {
    const { props, shapeFlag, type, children } = vnode
    let el = (vnode.el = hostCreateElement(type))
    if (props) {
      for (const key in props) {
        hostPatchProps(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
    }
    hostInsert(el, container)
  }
  const mountChildren = (children, el) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalizeVnode(children[i])
      patch(null, child, el)
    }
  }
  const processText = (n1, n2, container) => {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    } else {
    }
  }
  const patch = (n1, n2, container) => {
    const { shapeFlag, type } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container)
        }
    }
  }

  const render = (vnode, container) => {
    patch(null, vnode, container)
  }
  return {
    createApp: createAppApi(render),
  }
}
