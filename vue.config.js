const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.paramada.poke-mada',
        productName: 'PokeMada',
        win: {
          target: 'nsis',
        },
        icon: 'public/icons/icon.png'
      }
    }
  }
})
