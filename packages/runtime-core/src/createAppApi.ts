export const createAppApi = (render) => {
  return function createApp(rootComponent, rootProps = {}) {
    const app = {
      mount(container) {
        /**
         * 根据组件创建虚拟节点
         * 将虚拟节点和容器利用render去渲染
         * 关注点分离
         */
        let vnode = {}
        render(vnode, container)
      },
    }
    return app
  }
}
