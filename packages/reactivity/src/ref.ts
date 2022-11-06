import { toReactive } from './reactive'
import { activeEffect, trackDepEffect, triggerDepEffect } from './effect'
class RefImpl {
  public dep = new Set()
  public _v_isRef
  public _value
  constructor(public _rawVal) {
    this._value = toReactive(_rawVal)
  }
  get value() {
    if (activeEffect) {
      trackDepEffect(this.dep)
    }
    return this._value
  }
  set value(newVal) {
    if (newVal !== this._rawVal) {
      this._rawVal = newVal
      this._value = toReactive(newVal)
      triggerDepEffect(this.dep)
    }
  }
}

function createRef(value) {
  return new RefImpl(value)
}
export function ref(val) {
  return createRef(val)
}
