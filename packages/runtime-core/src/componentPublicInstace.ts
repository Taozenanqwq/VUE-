import { hasOwn } from '@vue/shared'
export const publicInstanceProxyHandlers = {
  get(target, key, reciever) {
    const { _: instance } = target
    const { setupState, props, data } = instance
    if (key[0] == '$') return
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    } else if (hasOwn(data, key)) {
      return data[key]
    } else {
      return undefined
    }
  },
  set(target, key, value, receiver) {
    const { _: instance } = target
    const { setupState, props, data } = instance
    if (hasOwn(setupState, key)) {
      setupState[key] = value
    } else if (hasOwn(props, key)) {
      props[key] = value
    } else if (hasOwn(data, key)) {
      data[key] = value
    }
    return true
  },
}
