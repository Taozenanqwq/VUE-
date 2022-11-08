import { createAppApi } from './createAppApi'
export const createRenderer = (renderOptions) => {
  /**
   * 将render渲染vnode的方法和构建vnode的过程分开，实现关注点分离
   */
  const render = (vnode, container) => {}
  return {
    createApp: createAppApi(render),
  }
}
