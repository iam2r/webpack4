'use strict'

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清空打包目录的插件
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //CSS文件单独提取出来
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const cacheGroups = require('./config').build.cacheGroups
const prodWebpackConfig = merge(baseConfig, {
    optimization: { //webpack4.x的最新优化配置项，用于提取公共代码
        splitChunks: {
            cacheGroups
        },
        runtimeChunk: { name: 'runtime' },
        //runtimeChunk是webpack固定生成的一段代码，用来维护模块之间的以来关系的，比如给每个模块一个ID之类的，这部分代码跟你写的代码完全没有关系，所以单独切割出来能够防止他的变化影响你自己的代码的hash变化
        minimizer: [
            new WebpackParallelUglifyPlugin({
                uglifyJS: {
                    output: {
                        beautify: false, //不需要格式化
                        comments: false //不保留注释
                    },
                    compress: {
                        warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
                        drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
                        collapse_vars: true, // 内嵌定义了但是只用到一次的变量
                        reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
                    }
                }
            }),
            new OptimizeCSSPlugin({
                cssProcessorOptions: { safe: true }
            }),
            // new PurifyCSSPlugin({
            //     paths: glob.sync(path.join(__dirname, '../src/page/*.html'))
            // })

        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.join(__dirname, '..'),
            // exclude: ['vendor'],
            verbose: true,
            dry: false,
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedChunksPlugin(chunk => {
            if (chunk.name) {
                return chunk.name;
            }

            // eslint-disable-next-line no-underscore-dangle
            return [...chunk._modules]
                .map(m => path.relative(
                    m.context,
                    m.userRequest.substring(0, m.userRequest.lastIndexOf('.')),
                ))
                .join('_');
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash:8].css',
            chunkFilename: "css/[id].[chunkhash:8].css"
        }),
        new BundleAnalyzerPlugin()
    ]
})
module.exports = prodWebpackConfig;
