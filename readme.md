# egg-vue-spa-ssr-boilerplate

eggjs的vue单页面应用服务端渲染解决方案。

方案参考：[egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)

## 快速开始

```bash
  git clone git@github.com:acthtml/egg-vue-spa-boilerplate.git
  cd egg-vue-spa-ssr-boilerplate
  npm i

  # 开发
  npm run dev

  # 设置为生产环境
  export EGG_SERVER_ENV=prod

  # 构建
  npm run build

  # 部署发布
  npm run start

  # http://localhost:7001/app
```

## 项目文件架构

```
- /app
  - view
    - vue-ssr-server-bundle.json
  - web
    - api                       api(service)层
      - modules
      - index.js
    - components                公共组件
      - app
    - common                    公共类库
      - context                 绑定的全局的上下文
        - cookies               同构的cookies，在组件中通过this.$cookies访问
        - http                  axios实例，在组件中通过this.$http访问
      - directive
      - filter
      - plugins
      - utils
    - router                    路由
      - check_permission.js
      - index.js
      - routes.js
    - store                     vuex store
      - modules
      - index.js
    - views                     页面
      - home
        - home.vue
      - app.template.html       通用的html模板
      - app.vue                 单页面应用组件入口
    - app.js                    通用的应用实例
    - entry_client.js           客户端入口
    - entry_server.js           服务端入口
- /config
- /public/static 静态资源
```

文档索引：

- [api(service层)](./app/web/api/index.js)
- [router](./app/web/router/index.js)
- [store](./app/web/store/index.js)

## 服务端架构

架构上参考[egg-vue-webpack-boilerplate](https://github.com/hubcarl/egg-vue-webpack-boilerplate)，
因为前端架构的不同的原因，我进行了相关改造。

1. 使用[eggjs](https://eggjs.org/zh-cn/)作为服务端框架。
2. 使用[egg-easyvue](https://github.com/acthtml/egg-easyvue)进行vue的服务端渲染和热
  更新。其内部由下面的插件实现：
    - [egg-view-vue](https://github.com/eggjs/egg-view-vue)进行vue的服务端渲染。
    - [egg-webpack](https://github.com/hubcarl/egg-webpack)进行HMR。
3. 使用[egg-easywebpack](https://github.com/acthtml/egg-easywebpack)进行vue项目的
  webpack配置、编译构建。

## 使用

1. 配置静态文件服务（[egg-static](https://github.com/eggjs/egg-static)）

```js
  // /config/config.default.js
  // 使静态文件的地址和文件夹分别跟webpack所需要的静态文件服务地址和产物文件夹所匹配。
  // 例如这里静态地址为http://localhost:7001/public/，静态产物在根目录的/public/static
  // 文件夹中。
  exports.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  }
```

2. 设置webpack配置([egg-webpack](https://github.com/hubcarl/egg-webpack))，具体参考
[egg-easywebpack](https://github.com/acthtml/egg-easywebpack)。

```js
  // /config/config.local.js
  const webpackConfig = require('egg-easywebpack');
  exports.webpack = {
    webpackConfigList: [
      webpackConfig('client', 'local', {enableHMR: true}),
      webpackConfig('server', 'local', {enableHMR: true})
    ]
  }

  // /config/config.prod.js
  const webpackConfig = require('egg-easywebpack');
  exports.webpack = {
    webpackConfigList: [
      webpackConfig('client', 'prod', {
        client: {
          publicPath:'//cdn.example.com/static/'
        }
      }),
      webpackConfig('server', 'prod', {
        client: {
          publicPath:'//cdn.example.com/static/'
        }
      })
    ]
  }
```

3. 设置单页面应用根目录，具体参考[egg-easyvue](https://github.com/acthtml/egg-easyvue)。

```js
  exports.easyvue = {
    // 站点spa根目录，默认为/app
    siteRoot: '/app',
  }
```

4. 进入开发模式，带有HMR和自更新。

```bash
  npm run dev
  # http://localhost:7001/app
```

5. 部署发布，具体参考[egg-scripts](https://github.com/eggjs/egg-scripts)

```bash
  # 构建静态文件
  export EGG_SERVER_ENV=prod && npm run build

  # 启动服务（后台运行模式）
  npm run start-bg
  # 启动服务（前台运行模式）
  npm run start
```




