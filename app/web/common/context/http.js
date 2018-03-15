/**
 * http请求模块，基于[axios](https://github.com/axios/axios)。
 *
 * 会根据当前环境配置(./config/目录)初始化axios实例。
 *
 * 因为axios是前后端都共用的，所以不要直接设置axios，而是使用它的实例。例如你想全局一些默认
 * 配置，你可以这样：
 *
 * ```js
 * // 引入这个模块
 * import http from '~/common/http';
 * // 设置默认
 * http.default.baseURL = 'some base url'
 * ```
 *
 * 初始化时，http模块能根据当前的环境加载对应的配置项。例如这里默认的配置是开发环境访问本地
 * 代理，上线时自动切换到线上地址。
 *
 * @module utils/http
 */
import axios from 'axios';
import config from '~/config';

export default (cookies, logger) => {
  let http = axios.create(config.http);

  // add authoriztion token
  if(config.auth && config.auth.enabled && cookies.get('authToken')){
    http.defaults.headers.common['x-auth-token'] = cookies.get('authToken');
  }
  return http;
}
