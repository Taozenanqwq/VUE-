let activeEffect
export class ReactiveEffect{
  public active = true
  public parent = null
  public deps = []
  constructor(public fn){
    this.run()
  }
  run(){
    if(!this.active) return this.fn()
    try{
      this.parent = activeEffect
      activeEffect = this
      return this.fn()
    }finally{  
      activeEffect = this.parent
      this.parent = null
    }
  }
}

export function effect(fn){
  const _effect = new ReactiveEffect(fn)
}

const targetMap = new WeakMap()
export function trackEffect(target, key){
  if(!activeEffect) return 
  let depsMap = targetMap.get(target)
  if(!depsMap){
    targetMap.set(target,depsMap = new Map())
  }
  let dep = depsMap.get(key)
  if(!dep){
    depsMap.set(key,dep = new Set())
  }
  let shouldTrack = !dep.has(activeEffect)
  if(shouldTrack) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

export function triggerEffect(target, key, value){
  const depsMap = targetMap.get(target)
  if(!depsMap) return
  const dep = depsMap.get(key)
  if(!dep) return 
  dep && dep.forEach((effect)=>{
    if(effect !== activeEffect) effect.run()
  })
}