var pathModule = require('path');

var promises = require('bluebird');

var needle = require('needle');

var _ = require('lodash');

var config = require('../config');

var util = require('../util');

var exists = require('fs').existsSync;

var qn = require('qn');

var ItemCloudList = null;
var FileCache = {};
var qnclient = promises.promisifyAll(qn.create(config.qn));
module.exports = function(fileStr) {
	var files = fileStr.split('+');
	files = _.compact(files);
	promises.map(files, function(file) {
		return new File(file).sendToasd();
	}).map(function(arg, index) {
		var file = FileCache[files[index]];
		file.asdok = !!(arg && arg[1] == 'ok');
		return file.Cloud();
	}).then(function() {

	}).catch(function(err) {
		console.log(err);
	});
}



var File = function(p) {
	var extname = pathModule.extname(p);
	p += (extname ? '' : '.js')
	this.path = pathModule.resolve(process.cwd(), p);
	this.rePath = p;
	this.extname = extname || '.js';
	this.exists = exists(this.path);
	this.asdok = false;
	FileCache[p] = this;
}

//发送到asd
File.prototype.sendToasd = function() {
	//不存在就跳过这一步骤
	if (!this.exists || this.asdok) return Promise.resolve();
	var option = {
		file: this.path,
		content_type: util.GetContentTypeByExtname(this.extname)
	}
	promises.promisifyAll(needle);
	return needle.postAsync(config.adsurl, option, {
		multipart: true
	});
}

//处理云端的文件
File.prototype.Cloud = function() {
	//不存在或者没有保存到asd就跳过
	if (!this.exists || !this.asdok) return Promise.resolve(this.path);
	GetCloudList()
		.then(this.GetRemoveList)
		.then(RemoveCloudList);

}

//返回可以删除的list
File.prototype.GetRemoveList = function(cloudList) {
	var rePath = this.rePath;
	return promises.map(cloudList, function(cloudUrl) {
		//暂时简单判断,如何进行较为严谨的判断
		if (util.CloudKeyCanRemove(cloudUrl, rePath)) {
			return cloudUrl;
		}
		return false;
	})
}

//获取云上面的静态文件列表
var GetCloudList = function() {
	if (ItemCloudList) return promises.resolve(ItemCloudList);
	return qnclient.listAsync('/').then(function(arg) {
		ItemCloudList = ['/Static/js/common/$$headJs.js,ua/ua.js', '/Static/temp/USList.js'] //arg[0].items;
		return ItemCloudList;
	});
}


var RemoveCloudList = function() {

}