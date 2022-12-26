import { parseHTML } from './compiler'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function compileToRender(template) {
  const ast = parseHTML(template)
  const code = codegen(ast)
  console.log(code)
  return code
}
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if ((attr.name = 'style')) {
      let obj = {}
      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
function genChildren(ast) {
  const children = ast.children
  if (children) {
    return children.map((child) => gen(child)).join(',')
  }
}
function gen(child) {
  if (child.type == 3) {
    return codegen(child)
  } else {
    const text = child.text
    if (defaultTagRE.test(text)) {
      let tokens = []
      let match
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    } else {
      return `_v('${text}')`
    }
  }
}
function codegen(ast) {
  let children = genChildren(ast)
  let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'},${ast.children.length > 0 ? children : ''})`
  return code
}
