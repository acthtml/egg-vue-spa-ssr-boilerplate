/**
 * store
 *
 * store是vuex的实现，[文章和架构参考](https://vuex.vuejs.org/zh-cn/structure.html)。
 *
 * ## 创建store module
 *
 * 在文件夹`store/modules`中创建模块，创建之后只要使用`store.register`进行模块注册即可，
 * 文件名采用`snake_case`即可。
 *
 * ```js
 *   // 创建模块
 *   // 文件: store/modules/book.js
 *   // 整个模块的默认格式如下。
 *   export default (namespace, {store, cookies, api, logger, http}) => {
 *     return {
 *       // store module的定义
 *       namespaced: namespace ? true : false,
 *       state(){
 *         return {}
 *       }
 *       // getters,
 *       // mutations,
 *       // actions
 *     }
 *   }
 * ```
 *
 * ## 使用store module
 *
 * 要使用模块，先要进行注册，使用`store.register`进行模块注册，注册的本地是用`vuex`中的
 * `registerModule`这个api，所以注册成功就能在相应的命名空间访问到了。
 *
 * ```js
 *   // 某某组件中
 *   {
 *     // `store`在`asyncData`方法中已经注入，在组件实例中可使用`this.$store`来访问。
 *     async asyncData({store}){
 *       // 添加模块
 *       // store.register(namespace, modulepath, ...args)
 *
 *       // 向命名空间example/some添加模块example/some
 *       store.register('example/some', 'example/some');
 *       // 该语句有个简写
 *       store.register('example/some');
 *     },
 *
 *     created(){
 *       this.$store.register('example/some')
 *     }
 *   }
 * ```
 *
 * 其他一些api，可看下方具体代码
 *
 * - store.register(namespace[, modulepath[, ...args]])
 * - store.unregister(namespace)
 * - store.isRegister(namespace)
 * - store.once(type, namespace, name[, ...args])
 * - store.ensure(type, namespace, name)
 *
 * ## 注意点
 *
 * 1. 如果模块需要在组件beforeCreate生命周期(包含beforeCreate)前使用，那么这个模块需要在路由
 * 组件的asyncData中注入。[参考服务器端数据预取](https://ssr.vuejs.org/zh/data.html)
 * 2. 保留命名空间'route'。[参考vue-router-sync](https://github.com/vuejs/vuex-router-sync)
 *
 * @module store
 */
import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);


/**
 * 返回store实例，并给实例添加register
 * @param  {[type]} context [description]
 * @return {[type]}       [description]
 */
export default context => {
  let store = new Vuex.Store({});

  /**
   * 给store动态添加模块，保证不会在命名空间上重复添加。
   * @param {String|Array} namespace 命名空间
   * @param {String} modulepath 模块路径，相对于~/store/modules这个路径，如果忽略这个属
   * 性，则以namespace作为模块路径。
   * @return {Boolean} 返回是否添加成功。
   */
  store.register = function(namespace, modulepath, ...args){
    namespace = getNamespace(namespace);
    // 不能重复注册
    if(this.isRegistered(namespace)) return false;
    if(!modulepath) modulepath = namespace;
    // 模块的引用统一成下划线命名模式，snakeCase
    modulepath = modulepath.split('/').map(i => _.snakeCase(i)).join('/')
    let mod = require('./modules/' + modulepath).default;
    this.registerModule(namespace, mod(namespace, {...context, store}, ...args));
    return true;
  }

  /**
   * 从store中卸载模块。
   * @param  {String|Array} namespace 命名空间名称
   * @return {Boolean}           是否卸载成功。
   */
  store.unregister = function(namespace){
    namespace = getNamespace(namespace);
    try{
      this.unregisterModule(namespace);
      delete this.cache[namespace];
      return true;
    }catch(e){
      return false;
    }
  }

  /**
   * 该命名空间下是否注册过模块
   * @param  {String|Array}  namespace 命名空间
   * @return {Boolean}       该命名空间下是否注册过模块
   */
  store.isRegistered = function(namespace){
    namespace = getNamespace(namespace);
    // 命名空间是以'/'结尾进行保存的。
    return !!this._modulesNamespaceMap[namespace + '/'];
  }

  /**
   * 检测该命名空间的这个方法只执行一遍，已执行过则不会再执行。
   * @param  {String}    type      执行类型, dispatch|commit
   * @param  {String}    namespace 命名空间
   * @param  {String}    name      执行的名称
   * @param  {Array} args      参数
   * @return {Mixed}              dispath/commit函数返回值。如果已执行，则返回undefined.
   * @todo  完善和应用。
   */
  store.cache = {};
  store.once = function(type, namespace, name, ...args){
    if(type != 'dispatch' && type != 'commit'){
      throw new Error(`store.once arguments type not support ${type}.`);
    }
    namespace = getNamespace(namespace);
    let key = `${type}:${name}`,
        cacheKey = `${type}:${name}:cache`,
        cache = this.cache[namespace];
    if(!cache){
      cache = this.cache[namespace] = {}
    }
    if(this.ensure(type, namespace, name)) return cache[cacheKey];
    cache[key] = true;
    cache[cacheKey] = this[type](namespace + '/' + name, ...args);
    return cache[cacheKey];
  }

  /**
   * 检测该命名空间的的这个方法有没有执行过。
   * @param  {[type]} type      [description]
   * @param  {[type]} namespace [description]
   * @param  {[type]} name      [description]
   * @return {[type]}           [description]
   */
  store.ensure = function(type, namespace, name){
    namespace = getNamespace(namespace);
    return !!this.cache[namespace][`${type}:${name}`];
  }

  return store;
}

/**
 * 返回命名空间字符串
 * @param  {String|Array} namespace 命名空间
 * @return {String}           命名空间字符串
 */
function getNamespace(namespace){
  if(namespace instanceof Array) namespace = namespace.join('/');
  namespace = namespace.replace(/\//ig, '/');
  return namespace;
}
