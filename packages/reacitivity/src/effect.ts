let activeEffect
class ReactiveEffect{
  public active = false
  constructor(public fn){
    this.run()
  }
  run(){
    if(!this.active) return this.fn()
    try{
      activeEffect = this
      return this.fn()
    }finally{  
      activeEffect = null
    }
  }
}

export function effect(fn){
  const _effect = new ReactiveEffect(fn)
}