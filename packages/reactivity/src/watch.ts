import { ReactiveEffect } from './effect'
import { isFunction, isObject } from '@vue/shared'
import { isReactive } from './reactive'

function traversal(source, set) {
  if (!isObject(source)) return
  for (let key of source) {
    if (!set.has(key)) {
      traversal(key, set)
      set.add(key)
    }
  }
}
export function watch(source, cb) {
  let callback
  let clean
  if (isReactive(source)) {
    let set = new Set()
    source = () => traversal(source, set)
  } else if (!isFunction(source)) {
    return
  }
  let onCleanup = (fn) => {
    clean = fn
  }
  let oldValue
  callback = () => {
    clean && clean()
    let newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(source, callback)
  oldValue = effect.run()
}
