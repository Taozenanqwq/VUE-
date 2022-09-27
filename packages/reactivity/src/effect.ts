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
      /** 执行前清空相关依赖，每次都重新收集，考虑分支切换场景 */
      cleanupEffects(this)
      return this.fn()
    }finally{  
      activeEffect = this.parent
      this.parent = null
    }
  }
}

export function effect(fn){
  const _effect = new ReactiveEffect(fn)
  return _effect
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
  let  dep = depsMap.get(key)
  if(!dep) return 
  /** 不断清空依赖，删除依赖形成死循环，因此需要每次复制一份依赖执行 */
  dep = new Set(dep)
  dep && dep.forEach((effect)=>{
    if(effect !== activeEffect) effect.run()
  })
}

function cleanupEffects(activeEffect){
   const { deps } = activeEffect
   for(let key of deps){
     key.delete(activeEffect)
   }
   activeEffect.deps = []
}