/**
 * 认证模块
 * @module api/auth
 */
import _ from 'lodash';

export default (http, api, logger) => {
  return {
    /**
     * 认证。发送ticket或x-auth-token至网关认证接口，返回用户信息。
     * @param  {String} account
     * @param  {String} token
     * @return {Object|null}   返回用户信息，如果没有成功获取，则返回null。
     */
    async auth(account, token){
      let params = {};
      if(account && token){
        params = {account, token};
      }

      // return http.get('/login', {
      //   params: {
      //     account,
      //     token
      //   }
      // }).then(rst => {
      //   if(!rst || !rst.data || !rst.data.result) return null;
      //   return rst.data.data;
      // }).catch(e => {
      //   logger.error('auth error', e);
      //   return null;
      // })

      return {
        "result": true,
        "data": {
          "userid": "u1234",
          "username": "admin",
          "roles": [
            "admin"
          ],
          "permissions": [
            "view",
            "edit",
            "add",
            "delete"
          ],
          "token": "this-a-token-hash",
          "tokenExpires": 1931108124527
        }
      }
    },
    /**
     * 登录
     * @param {String} username 用户名
     * @param {String} password 密码
     * @return {Object} 登录不成功返回null，否则返回用户信息
     *         - userid
     *         - permissions
     *         - token
     *         - tokenExpires
     *
     * @todo 未实现
     */
    async login(username, password){
      return null;
    },
    /**
     * 当前用户登出
     * @return {Boolean} 是否登出成功
     * @todo 未实现
     */
    async logout(){
      return true;
    }
  }
}



