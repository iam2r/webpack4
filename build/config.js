/**
 * 全局配置文件
 */

module.exports = {
	dev: {
		publicPath: '/',
		port: 8080,
		host: '0.0.0.0',
		assetsSubDirectory: 'assets',
		proxy: {
			// 'api/': {
			// 	target: 'http://39.107.78.155:7777',//设置你调用的接口域名和端口号 别忘了加http
			// 	changeOrigin: true,
			// 	pathRewrite: {
			// 		'^api/': ''
			// 		//这里理解成用‘/api’代替target里面的地址，
			// 		// 后面组件中我们掉接口时直接用api代替 比如我要调
			// 		// 用'http://40.00.100.100:3002/user/add'，直接写‘/ api / user / add’即可
			// 	}
			// },
		},

	},
	build: {
		publicPath: './',
		assetsSubDirectory: 'assets',
		cacheGroups: {
			vue: {
				test: /[\\/]vue[\\/]/,
				name: 'vue',
				chunks: 'initial',
				enforce: true
			},
			pixi: {
				test: /[\\/]pixi\.js[\\/]/,
				name: 'pixi',
				chunks: 'initial',
				enforce: true
			},
			vendors: {
				test: /[\\/]node_modules[\\/]/,
				chunks: 'initial',
				name: 'vendors',
				priority: -10,
				enforce: true
			},
			'async-vendors': {
				test: chunk => (
					chunk.resource &&
					/\.js$/.test(chunk.resource) &&
					/node_modules/.test(chunk.resource)
				),
				minChunks: 2,
				chunks: 'async',
				name: 'async-vendors'
			},
			styles: {
				name: 'styles',
				// test: /\.(css|s[ac]ss)$/,
				test: module => module.nameForCondition &&
					/\.(css|s[ac]ss)$/.test(module.nameForCondition()) &&
					!/^javascript/.test(module.type),
				chunks: 'all',
				enforce: true,
			},

		}
	},
	dllVendorPath: './vendor/vendor.dll.js'

}