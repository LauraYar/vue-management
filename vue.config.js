const { defineConfig } = require('@vue/cli-service');
// 自定义webpack配置过程
module.exports = defineConfig({
  transpileDependencies: true,
  // lintOnSave: false,
  // 发布模式production
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      // 发布阶段：清空默认打包入口‘app’,添加自定义的打包入口‘main-prod.js’
      config.entry('app').clear().add('./src/main-prod.js');
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
      });
      config.plugin('html').tap((args) => {
        args[0].isProd = true;
        return args;
      });
    });
    // 开发模式
    // 开发阶段：清空默认打包入口‘app’,添加自定义的打包入口‘main-prod.js’
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.entry('app').clear().add('./src/main-dev.js');
      config.plugin('html').tap((args) => {
        args[0].isProd = false;
        return args;
      });
    });
  },
});
