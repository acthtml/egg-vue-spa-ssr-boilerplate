module.exports = app => {
  app.get(`${app.config.easyvue.siteRoot}(.+)?`, 'app.app.index');
}
