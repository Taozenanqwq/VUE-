import { createAppApi } from './createAppApi'
import { ShapeFlags } from './shapeFlag'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '@vue/reactivity'
import { isSameVnode, normalizeVnode, Text } from './vnode'
import { queueJob } from './schedular'
import { debug } from 'console'
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
    nextSibling: hostNextSibling
  } = renderOptions
  const setupRenderEffect = (instance, container) => {
    instance.update = effect(
      function componentEffect() {
        if (!instance.isMounted) {
          const instanceToUse = instance.proxy
          const subTree = (instance.subTree = instance.render.call(instanceToUse, instanceToUse))
          patch(null, subTree, container)
          instance.isMounted = true
        } else {
          const prevTree = instance.subTree
          const instanceToUse = instance.proxy
          const nextTree = instance.render.call(instanceToUse)
          patch(prevTree, nextTree, container)
        }
      },
      {
        schedular: queueJob
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
  /** 挂载组件 */
  const mountComponent = (initialVnode, container) => {
    const instance = (initialVnode.component = createComponentInstance(initialVnode))
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }
  /** 处理元素 */
  const processElement = (n1, n2, container, anchor) => {
    if (n1 == null) {
      mountElement(n2, container, anchor)
    } else {
      patchElement(n1, n2, container)
    }
  }
  /** 挂载元素 */
  const mountElement = (vnode, container, anchor = null) => {
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
    hostInsert(el, container, anchor)
  }
  const mountChildren = (children, el) => {
    for (let i = 0; i < children.length; i++) {
      let child = normalizeVnode(children[i])
      patch(null, child, el)
    }
  }
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i])
    }
  }
  /** 更新元素 */
  const patchElementProps = (el, pre, next) => {
    if (pre !== next) {
      for (let key of Object.keys(next)) {
        const preVal = pre[key]
        const nextVal = next[key]
        if (preVal !== nextVal) {
          hostPatchProps(el, key, preVal, nextVal)
        }
      }
      for (const key in pre) {
        if (!(key in next)) {
          hostPatchProps(el, key, pre[key], null)
        }
      }
    }
  }
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children
    const c2 = n2.children
    const preFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    if (preFlag & ShapeFlags.TEXT_CHILDREN) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, c2)
      } else {
        hostSetElementText(el, '')
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el)
        }
      }
    } else if (preFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        /** diff算法：前后都是数组类型的孩子 */
        patchKeyedChildren(c1, c2, el)
      } else {
        unmountChildren(c1)
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, c2)
        } else {
          hostSetElementText(el, '')
        }
      }
    } else {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, c2)
      } else {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el)
        }
      }
    }
  }
  const patchKeyedChildren = (c1, c2, el) => {
    let e1 = c1.length - 1
    let e2 = c2.length - 1
    let i = 0
    /** 从头开始向后找，相同直接复用元素，不同则停止 */
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      i++
    }
    /** 从后向前找，相同直接复用元素，不同则停止 */
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--
      e2--
    }
    /** 有一方已经完全比对完成 */
    if (i > e1) {
      while (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < c2.length ? c2[nextPos].el : null
        patch(null, c2[i], el, anchor)
        i++
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i])
        i++
      }
    } else {
      let s1 = i,
        s2 = i
      const map = new Map()
      for (let i = s2; i < e2; i++) {
        const node = c2[i]
        if (node.key !== undefined) map.set(node.key, i)
      }
      const toBePatched = e2 - s2 + 1
      const newIndexToOldIndex = new Array(toBePatched).fill(0)
      for (let i = s1; i < s1; i++) {
        const oldNode = c1[i]
        const newIndex = map.get(c1[i].key)
        if (newIndex) {
          newIndexToOldIndex[newIndex] = i + 1
          patch(oldNode, c2[newIndex], el)
        } else {
          unmount(oldNode)
        }
      }
      for (let i = toBePatched; i >= 0; i--) {
        const child = c2[i + s2]
        const anchor = c2[i + s2 + 1] ? c2[i + s2 + 1].el : null
        if (newIndexToOldIndex[i + s2] == 0) {
          patch(null, child, el, anchor)
        } else {
          /** 获取最长递增子序列，减少dom移动操作，有点复杂这里暂不实现 */
          hostInsert(child.el, el, anchor)
        }
      }
    }
  }
  const patchElement = (n1, n2, container) => {
    const el = (n2.el = n1.el)
    const pre = n1.props || {}
    const next = n2.props || {}
    patchElementProps(el, pre, next)
    patchChildren(n1, n2, el)
  }

  /** 处理文本 */
  const processText = (n1, n2, container) => {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateText(n2.children)), container)
    } else {
    }
  }

  const unmount = (node) => {
    hostRemove(node.el)
  }
  const patch = (n1, n2, container, anchor = null) => {
    const { shapeFlag, type } = n2
    if (n1 && !isSameVnode(n1, n2)) {
      /** 获取新元素的插入锚点 */
      anchor = hostNextSibling(n1.el)
      unmount(n1)
      n1 = null
    }
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container)
        }
    }
  }

  const render = (vnode, container) => {
    patch(null, vnode, container)
  }
  return {
    createApp: createAppApi(render)
  }
}
