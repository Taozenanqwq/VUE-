import { createVNode } from './vnode'
export const createAppApi = (render) => {
  return function createApp(rootComponent, rootProps = {}) {
    const app = {
      _props: rootProps,
      _component: rootComponent,
      _container: null,
      mount(container) {
        /**
         * 根据组件创建虚拟节点
         * 将虚拟节点和容器利用render去渲染
         * 关注点分离
         */
        let vnode = createVNode(rootComponent, rootProps)
        render(vnode, container)
      },
    }
    return app
  }
}
