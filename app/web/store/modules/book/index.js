/**
 * @module store/book/list
 */

export default (namespace, {store, cookies, api, logger}) => {
  return {
    namespaced: true,
    state(){
      return {
        list: [],
        isLoading: false
      }
    },
    mutations: {
      init(state, list = []){
        state.list = list;
      },
      showLoading(state){
        state.isLoading = true;
      },
      hideLoading(state){
        state.isLoading = false;
      }
    },
    actions: {
      async getList({commit}){
        commit('showLoading');
        let list = await api('book').getList('vue');
        commit('init', list);
        commit('hideLoading');
      }
    }
  }
}
