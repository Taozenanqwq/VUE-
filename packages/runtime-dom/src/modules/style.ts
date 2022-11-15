export const patchStyle = (el, preStyle, nextStyle) => {
  let style = el.style
  if (!nextStyle) {
    el.removeAttribute('style')
  } else {
    if (preStyle) {
      for (let key of preStyle) {
        if (nextStyle[key] === null) {
          style[key] = ''
        }
      }
    }
    for (let key of Object.keys(nextStyle)) {
      style[key] = nextStyle[key]
    }
  }
}
