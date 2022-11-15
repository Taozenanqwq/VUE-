function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e)
  }
  invoker.value = value
  return invoker
}
export const patchEvents = (el, key, event) => {
  const invokers = el._vei || (el._vei = {})
  const exists = invokers[key]
  if (event && exists) {
    exists.value = event
  } else {
    const eventName = key.slice(2).toLowerCase()
    if (event) {
      let invoker = (invokers[eventName] = createInvoker(event))
      el.addEventListener(eventName, invoker)
    } else if (exists) {
      el.removeEventListener(eventName, exists)
      invokers[eventName] = undefined
    }
  }
}
