/**
 * 客户端
 * @see  https://github.com/vuejs/vue-hackernews-2.0/blob/master/src/entry-client.js
 */
import createApp from './app';

const appContext = createApp({siteRoot:window.__SITE_ROOT__}, 'client');
const {appCreator, router, store} = appContext;
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 需要store同步状态之后才能创建vue实例，这样就能在vue-router beforeEach中获取相应的权限
// 状态了。
const app = appCreator();

// 添加路由钩子函数，用于处理 asyncData.
// 在初始路由 resolve 后执行，
// 以便我们不会二次预取(double-fetch)已有的数据。
// 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to)
  const prevMatched = router.getMatchedComponents(from)
  let diffed = false
  const activated = matched.filter((c, i) => {
    return diffed || (diffed = (prevMatched[i] !== c))
  })
  const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
  if (!asyncDataHooks.length) {
    return next()
  }

  Promise.all(
    asyncDataHooks.map(hook => hook({
      ...appContext,
      app,
      route: to
    }))
  ).then(() => {
    next()
  })
  .catch(next);
})

router.onReady(() => {
  // actually mount to DOM
  app.$mount('#app')
})
