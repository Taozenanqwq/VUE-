import { nodeOps } from './nodeOps'
import { patchProps } from './patchProps'
import { extend } from '@vue/shared'
import { createRenderer } from '@vue/runtime-core'

/** 渲染时用到的方法 */
const renderOptions = extend({ patchProps }, nodeOps)

export function createApp(rootComponent, rootProps = {}) {
  const app = createRenderer(renderOptions).createApp(rootComponent, rootProps)
  const { mount } = app
  app.mount = (container) => {
    container = document.querySelector(container)
    container.innerHTML = ''
    mount(container)
  }
  return app
}
