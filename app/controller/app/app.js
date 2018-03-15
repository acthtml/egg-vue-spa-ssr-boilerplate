const path = require('path');

module.exports = app => {
  return class extends app.Controller {
    async index(){
      await this.ctx.render('vue-ssr-server-bundle.json',
        // local context
        {
          // 页面url
          url: this.ctx.url.replace(app.config.easyvue.siteRoot, ''),
          // 站点根目录
          siteRoot: app.config.easyvue.siteRoot,
          // cookies
          cookies: this.ctx.cookies,
          // koa ctx
          ctx: this.ctx
        },
        // render options
        {
          renderOptions: {
            // https://ssr.vuejs.org/zh/api.html#runinnewcontext
            runInNewContext: false
          }
        }
      )
    }
  }
}
