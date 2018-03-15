/**
 * example api
 * @module api/example
 */
export default (http, api, logger) => {
  return {
    /**
     * 获取列表
     * @param  {Number} page 第几页
     * @return {Array}       列表数据
     */
    async getList(tag) {
      return http.get('/book/search', {
        params: {
          tag
        }
      }).then(rst => {
        if (!rst || !rst.data) return [];
        return rst.data.books;
      }).catch(e => {
        logger.error('get books list error:', e);
        return [];
      })
    },
    /**
     * 获取详情
     * @param  {String} id
     * @return {Object} 详情
     */
    async getDetail(id) {
      return http.get(`/book/${id}`)
        .then(rst => {
          if (!rst || !rst.data) return null;
          return rst.data;
        }).catch(e => {
          logger.error('get book error:', e);
          return null;
        })
    }
  }
}
