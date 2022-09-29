export let activeEffect
export class ReactiveEffect {
  public active = true
  public parent = null
  public deps = []
  constructor(public fn, public schedular) {}
  run() {
    if (!this.active) return this.fn()
    try {
      this.parent = activeEffect
      activeEffect = this
      /** 执行前清空相关依赖，每次都重新收集，考虑分支切换场景 */
      cleanupEffects(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
      this.parent = null
    }
  }
  stop() {
    //停止收集依赖并且清空依赖
    if (this.active) this.active = false
    cleanupEffects(this)
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.schedular)
  _effect.run()
  const runner = _effect.run.bind(_effect) /** 绑定this值 */
  runner.effect = _effect
  return runner /** 返回该runner可以实现对effect的控制 */
}

const targetMap = new WeakMap()
export function trackEffect(target, key) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  trackDepEffect(dep)
}
export function trackDepEffect(dep) {
  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

export function triggerEffect(target, key, value) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  if (!dep) return
  /** 不断清空依赖，删除依赖形成死循环，因此需要每次复制一份依赖执行 */
  triggerDepEffect(dep)
}
export function triggerDepEffect(dep) {
  dep = new Set(dep)
  dep &&
    dep.forEach((effect) => {
      if (effect !== activeEffect)
        effect.schedular ? effect.schedular() : effect.run()
    })
}

function cleanupEffects(activeEffect) {
  const { deps } = activeEffect
  for (let key of deps) {
    key.delete(activeEffect)
  }
  activeEffect.deps = []
}
