const path = require('path')
const webpack = require('webpack')
const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const pkg = require('../package.json')
const utils = require('./utils')
const vendor = Object.keys(pkg.dependencies).reduce((pre,cur)=>{
    !/^@types/.test(cur)?pre.push(cur):'';
    return pre;
},[])
//将第三方库打包一边
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        vendor
    },
    output: {
        path: utils.resolve('dist'),
        filename: 'vendor/[name].dll.js',
        library: '_dll_[name]' // 全局变量名，其他模块会从此变量上获取里面模块
    },
    // optimization: { //webpack4.x的最新优化配置项，用于提取公共代码
        
    //     minimizer: [
    //         new WebpackParallelUglifyPlugin({
    //             uglifyJS: {
    //                 output: {
    //                     beautify: false, //不需要格式化
    //                     comments: false //不保留注释
    //                 },
    //                 compress: {
    //                     warnings: false, // 在UglifyJs删除没有用到的代码时不输出警告
    //                     drop_console: true, // 删除所有的 `console` 语句，可以兼容ie浏览器
    //                     collapse_vars: true, // 内嵌定义了但是只用到一次的变量
    //                     reduce_vars: true // 提取出出现多次但是没有定义成变量去引用的静态值
    //                 }
    //             }
    //         }),
         

    //     ]
    // },
    
    // manifest是描述文件
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: utils.resolve('dist/vendor/manifest.json'),
            context: path.resolve(__dirname, '../')
        })
    ]
}