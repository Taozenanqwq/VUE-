import { patchAttr } from './modules/attr'
import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchEvents } from './modules/events'
/** 属性操作 */
export const patchProps = (el, key, preVal, nextVal) => {
  switch (key) {
    case 'class':
      patchClass(el, nextVal)
      break
    case 'style':
      patchStyle(el, preVal, nextVal)
      break
    default:
      if (/^on[^a-z]/.test(key)) {
        patchEvents(el, key, nextVal)
      } else {
        patchAttr(el, key, nextVal)
      }
  }
}
