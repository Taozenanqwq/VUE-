export const patchClass = (el, newVal) => {
  if (newVal == null) {
    newVal = ''
  }
  el.className = newVal
}
