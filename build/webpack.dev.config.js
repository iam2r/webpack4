const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html的插件
const openBrowserWebpackPlugin = require("open-browser-webpack-plugin");
const webpack = require('webpack')
const baseConfig = require('./webpack.base')
const merge = require('webpack-merge')
const config = require('./config')
const devWebpackConfig = merge(baseConfig, {
  devtool: 'eval-source-map', // 指定加source-map的方式
  devServer: {
    inline: true,//打包后加入一个websocket客户端
    hot: true,//热加载
    contentBase: path.join(__dirname, "..", "dist"), //静态文件根目录
    port: config.dev.port, // 端口
    host: config.dev.host,
    historyApiFallback: true,//html5 history API
    overlay: true,
    compress: false, // 服务器返回浏览器的时候是否启动gzip压缩
    proxy: config.dev.proxy
  },
  watchOptions: {
    ignored: /node_modules/, //忽略不用监听变更的目录
    aggregateTimeout: 500, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    poll: 1000 //每秒询问的文件变更的次数
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '../dist/vendor/manifest.json')
    }),
    // new webpack.HotModuleReplacementPlugin(), //HMR
    // new webpack.NamedModulesPlugin(), // HMR
    new openBrowserWebpackPlugin({   // 自动打开浏览器  
      url: `http://localhost:${config.dev.port}`
    }),
  ]
})

module.exports = devWebpackConfig