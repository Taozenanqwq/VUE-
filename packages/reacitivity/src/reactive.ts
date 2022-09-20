import { isObject } from "@vue/shared";

/** 记录原对象和代理对象的关系 */
const reactiveMap = new WeakMap()

/** 一些标识字段 */
const enum ReactiveFlags{
  IS_REACTIVE = '__v_isReactive'
}

export function reactive(obj){
  if(!isObject(obj)) return obj
  if(obj[ReactiveFlags.IS_REACTIVE]) return obj 
  if(reactiveMap.has(obj)) return reactiveMap.get(obj) /** 已经存在map里直接走缓存 */
  const proxy = new Proxy(obj, {
    get(target, key, receiver){
      /** 判断是否已经为代理对象 */
      if(key === ReactiveFlags.IS_REACTIVE) return true
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver){
      return Reflect.set(target, key, value, receiver)
    }
  })
  reactiveMap.set(obj,proxy)
  return proxy
}