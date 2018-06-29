'use strict'
const path = require('path');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HappyPack = require('happypack')
const webpack = require('webpack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //CSS文件单独提取出来
const HtmlWebpackPlugin = require('html-webpack-plugin') // 生成html的插件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制静态资源的插件
const utils = require('./utils')
const config = require('./config')
//创建入口
const Entries = {};
const HtmlWebpackPlugins = [];
const cacheGroups = config.build.cacheGroups;
const htmlChunks = [];
for (const key in cacheGroups) {
  if (cacheGroups.hasOwnProperty(key)) {
    const element = cacheGroups[key];
    htmlChunks.push(element.name)
  }
}

//循环模板构建多个Html及创建对应入口
utils.getFileNameList('./src', 'html').forEach(page => {
  HtmlWebpackPlugins.push(new HtmlWebpackPlugin({//构建多个html
    template: path.resolve(__dirname, `../src/${page}.html`),
    title: page,
    filename: `${page}.html`,
    inject: 'body',
    chunks: [page, ...htmlChunks,'runtime'],
    parmas: {//自定义参数传入模板
      dllVendorPath:utils.isDev()?config.dllVendorPath:'',//开发模式用dll动态形式引用第三方库
    },
    hash: !utils.isDev(),//防止缓存
    minify: {
      removeComments: !utils.isDev(),
      collapseWhitespace: !utils.isDev(),
      removeAttributeQuotes: !utils.isDev()//压缩 去掉引号
    },
    chunksSortMode: 'dependency'
  }));
  Entries[page] = path.resolve(__dirname, `../src/${page}.js`);
})

module.exports = {
  context: path.resolve(__dirname, '../'),//绝对路径，用于从配置中解析入口起点(entry point)和加载器(loader)，以后若设置相对路径 相对当前目录的上一级
  entry: Entries,
  output: {
    path: utils.resolve('dist'),
    publicPath: utils.isDev() ? config.dev.publicPath : config.build.publicPath,//这里要放的是静态资源CDN的地址(一般只在生产环境下配置)
    filename: utils.isDev() ? 'js/[name].js' : 'js/[name].[hash].js'
  },
  resolve: {
    extensions: [".js", ".vue", ".ts", ".json"],
    alias: {
     
    } //配置别名可以加快webpack查找模块的速度
  },
  module: {
    // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: [utils.resolve('src')],
      },
      {
        test: /\.less$/,
        use: [ utils.isDev() ? 'vue-style-loader' : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        },
          {
            loader: 'css-loader',
            options: {
              localIdentName: 'purify_[hash:base64:5]',
            }
          }, 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.s?css$/,
        use: [ utils.isDev() ? 'vue-style-loader' : {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        },
          {
            loader: 'css-loader',
            options: {
              localIdentName: 'purify_[hash:base64:5]',
            }
          }, 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: utils.isDev() ?[
          {
            loader: 'awesome-typescript-loader'
          }
        ]:[
          {
            loader: 'happypack/loader?id=happy-babel-js'
          },
          {
            loader: 'awesome-typescript-loader'
          }
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'happypack/loader?id=happy-babel-js',
        include: [utils.resolve('src')],
        exclude: /node_modules/,
      },
      { //file-loader 解决css等文件中引入图片路径的问题
        // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: utils.assetsPath('images/[name].[hash:7].[ext]'), // 图片输出的路径
          limit: 8 * 1024
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },

  plugins: [
   
    new HappyPack({
      id: 'happy-babel-js',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool
    }),


    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    }),
    ...HtmlWebpackPlugins,
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      axios: 'axios',
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '..', 'static'),
        to: path.join(__dirname, '..', 'dist', 'static'),
        ignore: ['.*']
      }
    ]),

  ]
}