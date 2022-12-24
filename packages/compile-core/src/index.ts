import { match } from 'assert'
import { start } from 'repl'

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function compileToRender(template) {
  const ast = parseHTML(template)
  console.log(ast)
  return () => {}
}
function parseHTML(html) {
  const Element_Type = 3
  const Text_Type = 1
  const stack = []
  let currentParent
  let root
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: Element_Type,
      attrs,
      parent: null,
      children: []
    }
  }
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) {
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
  }
  function chars(text) {
    currentParent.children.push({
      type: Text_Type,
      text,
      parent: currentParent
    })
  }
  function end() {
    stack.pop()
    currentParent = stack[stack.length - 1]
  }
  function advance(len) {
    html = html.substring(len)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)
      let attr, end
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
  }
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)[0]
      if (endTagMatch) {
        end()
        advance(endTagMatch.length)
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        advance(text.length)
        chars(text.replace(/\s{2,}/g, ' '))
      }
    }
  }
  return root
}
