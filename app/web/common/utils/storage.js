/**
 * 对localstorage的封装
 *
 * 浏览器端only，服务器端会取不到数据，但不会报错，但是对于ssr来说，会出现状态不一致的情况，
 * 所以，建议在created之后的生命周期中使用。
 *
 * 该storage抽象，能将数据都存储在同一个key里，并能添加有效期。
 *
 *
 * ```js
 * // 初始化storage
 * let storage = new Storage({
 *   // 存储在哪个key里
 *   key: 'hotel:mobile:search',
 *   // 有效期为1天，超过有效期，取到的值为undefined.
 *   expire: 24 * 60 * 60 * 1000
 * })
 *
 * storage.get('a.b.c', '取不到值之后的默认值')
 * storage.set('a.b.c', 'somevalue');
 * storage.remove('a.b.c')
 *
 * ```
 *
 * @module utils/storage
 */

var localStorage;
// 兼容node环境
if(typeof window != 'undefined'){
  localStorage = window.localStorage;
}
else if(typeof localStorage == 'undefined'){
  localStorage = {};
  localStorage.getItem = () => undefined;
  localStorage.setItem = () => {};
  localStorage.removeItem = () => {};
}

export default class Storage {
  constructor(options){
    if(!options.key) throw new Error('storage 初始化失败，请提供key');
    // 当前数据所在的key，一般是这个格式：'hotel[:projectname]';
    this._key = options.key || '';
    // 只是有效期，0是永久。
    this.expire = options.expire || 0;
    // 当前对应的数据
    this.data = null,
    this.init();
  }

  /**
   * 初始化，从localstroage
   */
  init(){
    let data = localStorage.getItem(this._key) || '';

    try{
      data = JSON.parse(data);
      if(typeof data != 'object' || !data) data = {}
    }catch(e){
      data = {}
    }

    // 添加默认时间戳
    if(!data._time) data._time = new Date().getTime();
    data._time = parseInt(data._time);

    // 判断有效期
    if(this.expire != 0){
      if(new Date().getTime() - data._time > this.expire){
        data = {_time: new Date().getTime()}
      }
    }

    this.data = data;
  }
  /**
   * 设置值
   * @param {string} key   对应的key
   * @param {mixed} value  对应的值
   */
  set(key, value){
    this.data[key] = value;
    localStorage.setItem(this._key, JSON.stringify(this.data));
  }
  /**
   * 获取值
   * @param  {string} key   对应的key
   * @param  {mixed} def   没有对应值时的默认值
   * @return {mixed}       对应的值
   */
  get(key, def){
    return this.data.hasOwnProperty(key) ? this.data[key] : def;
  }
  /**
   * 根据key来删除值
   * @param  {string} key 对应的key
   */
  remove(key){
    // 删除指定key
    if(key){
      delete this.data[key];
      localStorage.setItem(this._key, JSON.stringify(this.data));
    }
    // 删除全部
    else{
      localStorage.removeItem(this._key);
    }
  }
}
