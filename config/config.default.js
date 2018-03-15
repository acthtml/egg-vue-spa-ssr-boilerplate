const path = require('path');

module.exports = appInfo => {
  return {
    keys: appInfo.name + '1507273290111',
    security: {
      csrf: {
        // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
        // @todo 对于RESTful api应该如何解决跨域问题
        ignoreJSON: true,
        enable: false
      },
    },
    static: {
      prefix: '/public/',
      dir: path.join(appInfo.baseDir, 'public')
    }
  }
}
