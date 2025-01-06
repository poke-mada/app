const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ]
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',

      builderOptions: {
        appId: 'com.paramada.poke-mada',
        productName: 'PokeMada',
        win: {
          target: 'nsis',
        },
        icon: 'public/icons/icon.png',
        publish: ['github']
      }
    }
  }
})
