//项目发布结算使用的babel插件
let prodPlugins = [];
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/app'
  ],
  //发布产品时的插件数组
  ...prodPlugins
}
