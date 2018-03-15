/**
 * 使vue组件保持滚动位置，例如从终页返回列表页，还保持列表页原来位置。
 *
 * ```vue
 *  <some-component v-keep-scroll></some-component>
 * ```
 * @see https://github.com/shmy/vue-keep-scroll-plugin
 * @module plugins/keepScroll
 */
const attrName = "data-scroll-position";

function install(Vue){
  Vue.directive("keep-scroll", {
    bind (el, binding, vnode) {
      // 记录滚动位置。
      el.addEventListener("scroll", _.throttle((e) => {
          e = e.target;
          e.setAttribute(attrName, e.scrollLeft + "-" + e.scrollTop);
        }, 200), false);
      const restore = (el, attr) => {
        attr = attr.split("-");
        el.scrollLeft = attr[0];
        el.scrollTop = attr[1];
      };
      // https://github.com/mark-hahn/vue-keep-scroll/pull/4
      vnode.context.$on("hook:activated", () => {
        const refs = el.parentElement.querySelectorAll(`[${attrName}]`);
        [].forEach.call(refs, ref => {
          const attr = ref.getAttribute(attrName);
          attr && restore(ref, attr);
        });
      });
    }
  });
}


export default {install};
