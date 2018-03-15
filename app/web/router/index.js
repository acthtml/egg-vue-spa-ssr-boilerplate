/**
 * router
 *
 * vue-router的实现，[文档参考](https://router.vuejs.org/zh-cn/)。
 *
 * 在routes.js中配置路由，在`config.auth`配置是否认证。
 * @module router
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import checkPermission from './check_permission';
import config from '~/config';
import querystring from 'querystring';

Vue.use(VueRouter);

export default (appContext, entryType) => {
  const {store, cookies, ctx, logger} = appContext;

  let router = new VueRouter({
    routes,
    mode: 'history',
    // 需要设置base，因为eggjs还不允许根目录形式注入。
    // 配置参考 https://router.vuejs.org/zh-cn/api/options.html#base
    base: appContext.siteRoot
  });

  // 认证和权限
  // 1. 认证只在首次访问的服务端进行。
  // 2. 权限在每次路由请求时进行。
  // 是否已进行认证。避免同一请求不同路由跳转造成的重复认证。
  let triedAuth = false;
  router.beforeEach(async (to, from, next) => {
    // 1. 登录认证，只在服务端进行。
    if(!triedAuth && entryType == 'server' && config.auth.enabled){
      triedAuth = true;
      let {account, token} = to.query,
          authToken = cookies.get('authToken'),
          authAccount = cookies.get('authAccount'),
          // 是否登录成功
          flag = false;

      // 1.1 优先自动登录，新账号则不进行自动登录。
      if(authToken && (!account || account && authAccount == account)){
        flag = await store.dispatch('auth/autoLogin', {token: authToken});
      }

      // 1.2 尝试单点登录
      if(!flag && account && token){
        flag = await store.dispatch('auth/auth', {account, token});
      }

      // 1.3 未登录，进行跳转并结束流程。
      if(!flag && redirectLogin()){
        next();
        return;
      }
    }

    // 2. 权限判断。
    checkPermission(appContext, to, from, next);
  });

  /**
   * 跳转登录页面
   *
   * ** server only **
   * @return {Boolean} 是否进行了跳转
   */
  function redirectLogin(){
    let redircted = false;
    let authURL = config.auth.authURL;

    // 添加service
    if(authURL.indexOf('?') < 0){
      authURL += '?';
    }
    authURL += '&' +  querystring.stringify({sevice: ctx.href});

    // 外部路径直接跳转，结束流程。
    if(authURL.indexOf('http:') == 0 || authURL.indexOf('https:') == 0 || authURL.indexOf('//') == 0){
      ctx.redirect(authURL);
      redircted = true;
    }
    // 内部非当前路径，直接跳转，结束流程。
    else if(getPath(router.resolve(authURL).href) != ctx.path){
      ctx.redirect([appContext.siteRoot || '', authURL].join('/').replace(/\/\//ig, '/'));
      redircted = true;
    }
    return redircted;
  }

  return router;
};

/**
 * 获取url中的路径
 * @param  {[type]} href [description]
 * @return {[type]}      [description]
 */
function getPath(href){
  href = href.split('?');
  return href[0];
}
