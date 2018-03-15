const webpackConfig = require('egg-easywebpack');

module.exports = {
  webpack: {
    webpackConfigList: [
      webpackConfig('client', 'prod', {
        client: {
          publicPath:'/public/static/'
        }
      }),
      webpackConfig('server', 'prod', {
        client: {
          publicPath:'/public/static/'
        }
      })
    ]
  }
}
