var promises = require('bluebird');

var qn = require('qn');

var config = require('../config');

var util = require('../util');
var qnclient = promises.promisifyAll(qn.create(config.qn));


var Cloud = function() {
	this.ItemCloudList = null;
}



Cloud.prototype.Start = function(file) {
	if (!file.exists || !file.asdok) return Promise.resolve(file);
	return this.GetCloudList()
		.then(this.GetRemoveList(file.rePath))
		.then(this.RemoveCloudList);
}

//获取云上面的静态文件列表
Cloud.prototype.GetCloudList = function() {
	var ItemCloudList = this.ItemCloudList;
	if (ItemCloudList) return promises.resolve(ItemCloudList);
	return qnclient.listAsync('/').then(function(arg) {
		ItemCloudList = ['/Static/js/common/$$headJs.js,ua/ua.js', '/Static/temp/USList.js'] //arg[0].items;
		return ItemCloudList;
	});
}

//获得可以删除的列表
Cloud.prototype.GetRemoveList = function(rePath) {
	return function(cloudList) {
		return promises.map(cloudList, function(cloudUrl) {
			//暂时简单判断,如何进行较为严谨的判断
			if (util.CloudKeyCanRemove(cloudUrl, rePath)) {
				return cloudUrl;
			}
			return false;
		})
	}

}

//删除key
Cloud.prototype.RemoveCloudList = function(removeKeys) {
	return promises.map(removeKeys, function(removeKey) {
		return qnclient.deleteAsync(removeKey);
	})
}



module.exports = new Cloud();