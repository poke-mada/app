const {defineConfig} = require('@vue/cli-service')
const webpack = require('webpack');
const path = require('path');

module.exports = defineConfig({
    chainWebpack: config => {
        const fontsRule = config.module.rule('fonts');
        fontsRule.uses.clear();
        fontsRule
            .rule('fonts')
            .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
            .set('type', 'asset/resource')
            .set('generator', {
                filename: 'fonts/[name].[hash:8][ext]'
            });
    },
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: 'true',
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
            })
        ],
        resolve: {
            alias: {
                '@mdi/font': path.resolve(__dirname, 'node_modules/@mdi/font')
            }
        }
    },
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
            builderOptions: {
                appId: 'com.paramada.dedsafio',
                productName: 'Dedsafio Pokemon',
                win: {
                    target: 'nsis',
                },
                icon: 'public/icons/icon.ico',
                publish: [
                    {
                        "provider": "s3",
                        "bucket": "para-mada-deploy",
                        "region": "us-east-1",
                        "path": "dedsafio/"
                    }
                ]
            }
        }
    }
})
