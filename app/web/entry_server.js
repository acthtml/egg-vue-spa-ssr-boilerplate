/**
 * 服务端
 * @see  https://github.com/vuejs/vue-hackernews-2.0/blob/master/src/entry-server.js
 */
import createApp from './app';

export default context => {
  const appContext = createApp(context, 'server');
  const {appCreator, router, store} = appContext;
  const app = appCreator();

  router.push(context.url);
  // 解析动态组件。
  return new Promise((res, rej) => {
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        // @todo
        return rej({ code: 404 })
      }

      Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        ...appContext,
        app,
        route: router.currentRoute
      }))).then(() => {
        context.state = store.state
        res(app);
      }).catch(rej)
    }, rej)
  })
}


