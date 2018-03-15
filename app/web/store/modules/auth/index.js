/**
 * 认证模块
 * @module store/auth
 */
import _ from 'lodash';

export default (namespace, {store, cookies, api, logger}) => {
  return {
    namespaced: true,
    state(){
      return {
        // 用户id
        userid: '',
        // 用户名称
        username: '匿名用户',
        // 用户权限id
        permissions: [],
        // 用户角色id
        roles: [],
        // 用户token
        token: ''
      }
    },
    getters: {
      // 是否登录
      isLogin(state){
        return state.userid != '' && state.token != '';
      },
      /**
       * 当前用户是否拥有该权限
       * @param  {String} permission 权限列表
       * @return {Boolean}  如果权限列表中指出的权限全部拥有则
       * @todo  permission支持数组
       */
      access: state => permission => {
        return _.indexOf(state.permissions, permission) >= 0;
      }
    },
    mutations: {
      /**
       * 更新当前认证用户信息
       * @param  {Object} user  用户信息，包含如下信息：
       *                        - userid
       *                        - permissions
       *                        - token
       *                        - tokenExpires
       * @return {Boolean} 是否更新成功
       */
      update(state, user){
        if(!user || typeof user != 'object') return;
        if(user.userid) state.userid = user.userid;
        if(user.username) state.username = user.username;
        if(user.permissions) state.permissions = user.permissions;
        if(user.roles) state.roles = user.roles;
        if(user.token){
          state.token = user.token;
          if(user.tokenExpires > 0){
            cookies.set('authToken', user.token, {expires: new Date(user.tokenExpires), signed: false, httpOnly: false});
            cookies.set('authAccount', user.userid, {expires: new Date(user.tokenExpires), signed: false, httpOnly: false});
          }
        }
      },
      /**
       * 清空认证信息，常用于登出
       * @return {Boolean}   是否清空成功
       */
      reset(state){
        cookies.remove('authToken');
        cookies.remove('authAccount');
        state.token = '';
        state.userid = '';
        state.username = '匿名用户';
        state.permissions = [];
      }
    },
    actions: {
      /**
       * 用户进行单点登录
       * @param  {String} account
       * @param  {String} token
       * @return {Boolean}        是否单点登录成功
       */
      async auth({commit}, {account, token}){
        let user = await api('auth').auth(account, token);
        if(user){
          commit('update', user);
          return true;
        }
        return false;
      },
      /**
       * 自动登录
       * @param  {[type]} options.commit [description]
       * @param  {[type]} options.token  [description]
       * @return {[type]}                [description]
       */
      async autoLogin({commit}){
        let user = await api('auth').auth();
        if(user){
          commit('update', user);
          return true;
        }
        return false;
      },
      /**
       * 进行登录
       * @param  {String} options.username 用户名
       * @param  {String} options.password 密码
       * @return {Boolean}                 是否登录成功
       * @todo 未实现
       */
      async login({commit}, {username, password}){
        let user = await api('auth').login(username, password);
        if(user){
          commit('update', user);
          return true;
        }
        return false;
      },
      /**
       * 当前用户登出
       * @return {Boolean}  是否登出成功
       * @todo 未实现
       */
      async logout({commit}){
        let flag = await api('auth').logout();
        if(flag){
          commit('reset');
          return true;
        }
        return false;
      }
    }
  }
}
