var pathModule = require('path');

var promises = require('bluebird');

var needle = require('needle');

var _ = require('lodash');

var config = require('../config');

var util = require('../util');

var exists = require('fs').existsSync;

var qn = require('qn');


var FileCache = {};
var cloud = new Cloud();
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
	this.path = pathModule.resolve(process.cwd(), p) + (extname ? '' : '.js');
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
	cloud.GetCloudList().then(function(cloudList) {
		debugger;
	})

}

function Cloud() {
	this.qnclient = promises.promisifyAll(qn.create(config.qn));
	this.ItemCloudList = null;
}

Cloud.prototype.GetCloudList = function() {
	var ItemCloudList = this.ItemCloudList;
	if (ItemCloudList) return Promise.resolve(this);
	return this.qnclient.listAsync('/').then(function(arg) {
		ItemCloudList = arg[0].items;
		return this;
	});
}

Cloud.prototype.Dispose = function() {
	this.qnclient = null;
	this.ItemCloudList = null;
}