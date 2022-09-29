import { isFunction, isObject } from '@vue/shared'
import { effect, ReactiveEffect } from './effect'
import { trackDepEffect, triggerDepEffect } from './effect'
import { activeEffect } from './effect'
class ComputedRefImpl {
  public _dirty = true
  public _value
  public effect
  public __v_isReadonly = true
  public __v_isRef = true
  public dep = new Set()
  constructor(getter, public setter) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerDepEffect(this.dep)
      }
    })
  }
  get value() {
    if (activeEffect) trackDepEffect(this.dep)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
  set value(newValue) {
    this.setter(newValue)
  }
}
export const computed = (config) => {
  let onlyGetter = isFunction(config)
  let getter
  let setter
  if (onlyGetter) {
    getter = config
    setter = () => console.warn('no setter')
  } else {
    getter = config.getter
    setter = config.setter
  }
  return new ComputedRefImpl(getter, setter)
}
