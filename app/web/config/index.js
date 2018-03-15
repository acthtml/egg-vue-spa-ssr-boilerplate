/**
 * 系统配置
 *
 * 配置能根据环境加载相应的配置。
 *
 * ```js
 *   // 引入配置
 *   import config from '~/config';
 * ```
 * ** 重要 ** 确保有对应环境的配置项，否则会在编译阶段进行报错提醒。
 * @module config
 */

// 此`config`会根据当前的开发环境（local, test, production），自动获取对应的配置。例如在
// 开发环境`local`时，`import config from '@config'`获取到的配置实际来自于`config.local.js`。
import config from '@config';
export default config(WEBPACK_ENTRY_TYPE);
