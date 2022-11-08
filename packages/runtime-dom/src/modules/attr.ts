export const patchAttr = (el, key, val) => {
  if (!val) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, val)
  }
}
