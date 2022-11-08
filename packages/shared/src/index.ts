export const isObject = (obj) => typeof obj === 'object' && obj !== null
export const isFunction = (obj) => typeof obj === 'function'
export const extend = (origin, target) => {
  return { ...origin, ...target }
}
