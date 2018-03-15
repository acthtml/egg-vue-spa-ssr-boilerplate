/**
 * app实例
 *
 * @module app
 */
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import appComponent from './views/app.vue';
import contextPlugin from '~/common/plugins/context';
import createStore from './store';
import createRouter from './router';
import createCookies from '~/common/context/cookies';
import createHttp from '~/common/context/http';
import createLogger from '~/common/context/logger';
import createApi from '~/api';
import '~/common/plugins';
import '~/common/filter';

// add project ui
import AppUI from '~/components/app';
Vue.use(AppUI);

/**
 * 获取app实例，分别供客户端和服务端使用。
 * @see ./entry_client.js
 * @see ./entry_server.js
 * @param  {Object} context   上下文环境
 * @param  {String} entryType 实体类型，'client'或'server'
 * @return {Object} 返回一个对象，拥有以下属性：
 *         - app vue实例
 *         - store vuex实例
 *         - router vue-router实例
 *         - cookies 前后端通用的cookies
 *         - http axios实例
 *         - api @see ~/common/api
 */
export default (context, entryType) => {
  const logger = createLogger(context.ctx, entryType);
  const cookies = createCookies(context.cookies);
  const http = createHttp(cookies, logger);
  const api = createApi(http, logger);
  const store = createStore({...context, cookies, http, api, logger});
  const router = createRouter({...context, store, cookies, http, api, logger}, entryType);

  // 同步路由状态 @see https://github.com/vuejs/vuex-router-sync
  sync(store, router);
  // 注册权限模块
  store.register('auth');

  // 注入vue
  Vue.use(contextPlugin('http'));
  Vue.use(contextPlugin('api'));
  Vue.use(contextPlugin('cookies'));
  Vue.use(contextPlugin('logger'));

  // 返回构造app构造函数，为了在客户端环境，store的状态能在router挂载时初始好，这样就能做
  // 服务端的权限判断了。
  let app;
  const appCreator = () => {
    if(!app){
      app = new Vue({
        store,
        router,
        cookies,
        http,
        api,
        logger,
        render: h => h(appComponent)
      })
    }

    return app;
  };
  return {appCreator, store, router, cookies, http, logger, api, ctx:context.ctx, entryType};
}
