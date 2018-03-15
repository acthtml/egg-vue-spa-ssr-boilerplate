/**
 * 为vue注入自定义的上下文。
 *
 * 例如想为vue组件注入$http
 *
 * ```
 *   import Vue from 'vue';
 *   import contextPlugin from './context';
 *   import http from '../context/http'
 *   Vue.use(contextPlugin(), {name: 'http'});
 *
 *   new Vue({
 *     http
 *   })
 *
 *   // 在组件中使用
 *   this.$http .....
 * ```
 *
 * @module plugins/context
 */
let cache = {};
export default name => {
  let install = cache[name];
  if(!install){
    /**
     * 安装插件
     *
     * @param {Object}  [description]
     */
    install = function(Vue){
      if (install.installed) return;
      install.installed = true;
      Vue.mixin({
        beforeCreate(){
          const options = this.$options;
          const $name = '$' + name;
          if (options[name]) {
            this[$name] = options[name];
          } else if (options.parent && options.parent[$name]) {
            this[$name] = options.parent[$name];
          }
        }
      })
    }
    cache[name] = install;
  }

  return {install}
}
