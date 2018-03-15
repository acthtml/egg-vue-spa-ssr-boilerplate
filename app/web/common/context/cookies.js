/**
 * 前后端通用的cookie
 *
 * api提供: get, set, remove。其余平台特殊的api直接放在cookies属性中。
 *
 * 其中set参数options的有效期支持数字，表示天数。
 *
 * api参考：
 *
 * - 浏览器端 https://www.npmjs.com/package/js-cookie
 * - 服务器端 https://eggjs.org/zh-cn/core/cookie-and-session.html
 *
 * @module utils/cookies
 */
export default (koaCookies) => {
  let cookies, isNode;
  isNode = typeof window == 'undefined';
  cookies = isNode ? koaCookies : require('js-cookie');

  return {
    cookies,
    /**
     * 获取cookie
     * @param  {String} key     cookie key
     * @param  {Object} options cookie获取参数
     */
    get(key, options){
      if(typeof options == 'undefined'){
        options = {signed: false};
      }else if(typeof options == 'object' && !options.hasOwnProperty('signed')){
        options.signed = false;
      }
      return cookies.get(key, options);
    },
    /**
     * 设置cookie
     * @param {[type]} key     [description]
     * @param {[type]} value   [description]
     * @param {[type]} options [description]
     */
    set(key, value, options){
      if(options && options.expires && typeof options.expires == 'number'){
        options.expires = new Date(new Date().getTime() + options.expires * 24 * 60 * 60 * 1000)
      }
      return cookies.set(key, value, options);
    },
    /**
     * 删除cookie
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    remove(key){
      return isNode ? cookies.set(key, undefined) : cookies.remove(key);
    }
  }
}
