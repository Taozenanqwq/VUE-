export const nodeOps = {
  createElement: (tagName) => document.createElement(tagName),
  remove: (child) => {
    let parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },
  insert: (child, parent, anchor) => {
    parent.appendChild(child, anchor)
  },
  querySelector: (selector) => document.querySelector(selector),
  setElementText: (el, text) => (el.textContent = text),
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => (node.nodeValue = text),
}
