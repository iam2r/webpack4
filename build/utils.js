const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const config = require('./config')
//得到指定路径下指定后缀名的文件名集合
exports.getFileNameList = (path, suffix) => {
	let fileList = [];
	let dirList = fs.readdirSync(path);
	dirList.forEach(item => {
		if (item.indexOf(suffix) > -1) {
			fileList.push(item.split('.')[0]);
		}
	});
	return fileList;
};

exports.isDev = () => {
	return process.env.NODE_ENV === 'development'
}

exports.resolve = dir => {
	return path.join(__dirname, '..', dir)
}

exports.assetsPath = _path_ => {
	let assetsSubDirectory;
	if (process.env.NODE_ENV === 'production') {
		assetsSubDirectory = config.build.assetsSubDirectory //可根据实际情况修改
	} else {
		assetsSubDirectory = config.dev.assetsSubDirectory
	}
	return path.posix.join(assetsSubDirectory, _path_)
}

