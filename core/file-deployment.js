var promises = require('bluebird');

var needle = require('needle');

var _ = require('lodash');

var config = require('../config');

var util = require('../util');


var File = require('./File');

var Cloud = require('./Cloud');

var FileCache = {};



//发送到asd
var sendToasd = function(file) {
	//不存在就跳过这一步骤
	if (!file.exists || file.asdok) return Promise.resolve();
	var option = {
		file: file.path,
		content_type: util.GetContentTypeByExtname(file.extname)
	}
	promises.promisifyAll(needle);
	return needle.postAsync(config.adsurl, option, {
		multipart: true
	});
}



module.exports = function(files) {
	files = _.compact(files);
	promises.map(files, function(filePath) {
		var file = new File(filePath);
		FileCache[filePath] = file;
		return sendToasd(file);
	}).map(function(arg, index) {
		var file = FileCache[files[index]];
		file.asdok = !!(arg && arg[1] == 'ok');
		return Cloud.Start(file);
	}).then(function() {

	}).catch(function(err) {
		console.log(err);
	});
}