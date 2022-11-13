import { ShapeFlags } from './shapeFlag'
import { isObject, isString, isArray } from '@vue/shared'
export const createVNode = (type, props, children = null) => {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0
  const vnode = {
    _v_isVNode: true,
    type,
    props,
    key: props && props.key,
    children,
    el: null,
    shapeFlag, //判断出自己的类型和孩子的类型
  }
  normalizeChildren(vnode, children)
  return vnode
}
function normalizeChildren(vnode, children) {
  let type = 0
  if (children === null) {
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else {
    type = ShapeFlags.TEXT_CHILDREN
  }
  type = type | vnode.shapeFlag
  return type
}

export const isVnode = (target) => {
  return target._v_isVNode
}
