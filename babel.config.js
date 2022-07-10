// 项目发布阶段需要用到的babel插件
const prodPlugins = [];
// 如果处于发布模式production，就在数组里插入插件
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console');
}
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
      },
    ],
    // ...表示展开运算符（把数组中的每一项展开放到另一个数组中）  发布产品时候的数组
    ...prodPlugins,
  ],
};
