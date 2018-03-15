/**
 * 聚合组件
 *
 * @todo
 * - 进行重构，采用vue.component(name, component)这种形式。
 * - 是否可以进行延迟加载，而且要确保服务端渲染没有问题。
 */
import _ from 'lodash';
import Wrapper from './wrapper.vue';
import Content from './content.vue';

const components = {
  Wrapper,
  Content,
}

const prefix = 'app-';

export default {
  install(Vue, opts){
    _.each(components, (component, key) => {
      let name = prefix + _.kebabCase(key);
      Vue.component(name, component);
    });
  }
}
