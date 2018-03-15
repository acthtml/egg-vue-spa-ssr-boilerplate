/**
 * 路由设置
 *
 * 1. 参数配置如下
 *
 * - meta.permission 当前路由、菜单所需要的权限。
 *   - 如果值为字符串，则表示当前用户需要拥有字符串指定的权限。
 *   - 如果是数组，则表示当前用户需要拥有数组中的每个权限。
 *   - 如果是布尔值，则true表示当前路由无需权限（权限验证始终通过）。
 *   - 如果用户没有父路由权限，那么也不会进行子路由的匹配，直接进入401页面
 *
 * ```
 * @module router/routes
 * @see [vue-router](https://router.vuejs.org/)
 * @todo 一些重构时候的注意点：
 * - 是否路由应该跟菜单耦合在一起。
 *   - 顺序、子父级关系
 *   - 如果拆分，如何做面包屑导航。
 */
const routes = [
  {
    path: '/',
    alias: '/book',
    component: () => import('~/views/book/list.vue'),
  },
  {
    path: '/book/:id',
    name: 'book',
    component: () => import('~/views/book/book.vue'),
  },
  // 基础页面
  {
    path: '/401',
    name: '401',
    component: () => import('~/views/error/401.vue'),
    meta: {
      permission: true
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('~/views/error/500.vue'),
    meta: {
      permission: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('~/views/error/404.vue'),
    alias: '*',
    meta: {
      permission: true
    }
  },
];

export default routes;
