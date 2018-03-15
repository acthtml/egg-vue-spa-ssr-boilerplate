/**
 * api服务层
 *
 * 类似于service层，用于跟后端进行数据交互。
 *
 * ## api的创建
 *
 * api在文件夹`api/modules`中创建，创建后可在组件、store中使用，文件名采用`snake_case`规范。
 *
 * ```js
 *   // 创建api book。
 *   // 文件：api/modules/book.js
 *   // 整个模块的默认格式为如下，其函数返回内容即为这个api的可使用接口。
 *   export default (http, api, logger) => {
 *     return {
 *       async getList(){
 *         return http( ...do some http request)
 *       },
 *       async getDetail(){
 *         return http( ...do some http request)
 *       }
 *     }
 *   }
 * ```
 *
 * ## api的使用
 *
 * 在`store`中可直接通过`api`这个对象访问，注意下模块和文件的关系。
 *
 * ```js
 *   {
 *     // 某某store
 *     actions: {
 *       async init(){
 *         let data = await api('book').getList();
 *       }
 *     }
 *   }
 * ```
 *
 * 在组件中可通过`$api`这个对象访问：
 *
 * ```js
 *   {
 *     // 某某组件中
 *     methods: {
 *       async init(){
 *         let data = await this.$api('book').getList();
 *       }
 *     },
 *
 *     // 但在asyncData方法中，因为组件还没有实例化，所以通过参数进行注入了。
 *     async asyncData({api}){
 *       let data = await this.$api('book').getList();
 *     }
 *   }
 * ```
 * @module api
 */
import _ from 'lodash';

/**
 * api 网关
 * @param  {Object} http axios的实例，应该有~/common/context/http生成。
 * @param  {String} name api模块名称
 * @return {Mixed}       返回对应的api模块方法
 */
export default (http, logger) => {
  function api(name){
    let mod;
    try{
      // formate name to snakeCase.
      name = name.split('/').map(i => _.snakeCase(i)).join('/');
      mod = require('./modules/' + name).default;
    }catch(e){
      throw new Error(`api没有找到模块${name}`);
    }
    return mod(http, api, logger);
  }

  return api
}
