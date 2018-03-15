/**
 * 检测当前用户是否有指定路由权限。
 * @module router/checkPermission
 */
export default (appContext, to, from, next) => {
  const {store} = appContext;

  // 权限
  let hasPermission = true;
  for(let i = 0; i < to.matched.length; i++){
    let route = to.matched[i],
        permission = route.meta.permission;
    if(permission){
      // boolean
      if(typeof permission == 'boolean'){
        // do nothing
      }
      // string and array
      else if(typeof permission == 'string' || typeof permission == 'object'){
        if(!store.getters['auth/access'](permission)){
          hasPermission = false;
          break;
        }
      }
    }
  }

  if(hasPermission){
    next();
  }else{
    next({
      name: '401'
    })
  }
}
