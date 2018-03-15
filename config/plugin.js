const path = require('path');

module.exports = {
  validate: {
    enable: true,
    package: 'egg-validate'
  },
  vue: {
    enable: true,
    package: 'egg-view-vue'
  },
  webpack: {
    enable: true,
    package: 'egg-webpack',
    env: 'local'
  },
  easyvue: {
    enable: true,
    package: "egg-easyvue"
  }
}
