export const isObject = (obj) => typeof obj === 'object' && obj !== null
export const isFunction = (obj) => typeof obj === 'function'
export const extend = (origin, target) => {
  return { ...origin, ...target }
}
export const isString = (str) => {
  return typeof str === 'string'
}
export const isArray = (obj) => {
  return Object.prototype.toString.call(obj, null).slice(8, -1) === 'Array'
}
export const hasOwn = (target, prop) => {
  return target.hasOwnProperty(prop)
}
