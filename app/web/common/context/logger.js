/**
 * 日志
 *
 * @see https://eggjs.org/zh-cn/core/logger.html
 * @module common/context/logger
 */
import _ from 'lodash';
import config from '~/config';


export default (ctx, entryType) => {
  // 打印的级别
  const level = levelmap(_.get(config, 'logger.level', 'debug'), 'number');

  /**
   * 打印日志。
   * @param  {String}    type 类别
   * @param  {any} args  日志的参数
   */
  function logger(type, ...args){
    // 是否需要打印。
    if(level == 0) return;
    if(level > levelmap(type, 'number')) return;

    // 进行打印
    type = levelmap(type, 'string');

    // 服务端
    if(entryType == 'sever'){
      ctx.logger[type](...args);
    }
    // 客户端
    else{
      console[type == 'debug' ? 'info' : type](...args);
      // @todo 将日志通过网关记录。
    }
  }

  return {
    debug(...args){
      logger('debug', ...args);
    },
    info(...args){
      logger('info', ...args);
    },
    warn(...args){
      logger('warn', ...args);
    },
    error(...args){
      logger('error', ...args);
    }
  }
}

/**
 * 级别映射
 * - 'none' == 0
 * - 'debug' == 1
 * - 'info' == 2
 * - 'warn' == 3
 * - 'error' == 4
 * @param  {String|Number} level 级别
 * @param {String} type 返回级别的类型。
 * @return {String|Number}  根据type返回指定的级别。
 */
function levelmap(level, type = 'string'){
  const map = ['none', 'debug', 'info', 'warn', 'error'];
  if(type == 'number'){
    return typeof level == 'number' ? level : _.indexOf(map, level);
  }else{
    return typeof level == 'string' ? level : map[level];
  }
}
