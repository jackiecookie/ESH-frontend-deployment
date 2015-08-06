var _ = require('lodash');

var path = require('path');


module.exports.GetContentTypeByExtname = function(extname) {
	var result = '';
	switch (extname) {
		case '.js':
			result = 'application/x-javascript';
			break;
		case '.css':
			result = 'text/css';
			break;
	}
	return result;
}


var splitCloudUrl = function(cloudUrl) {
	var result = [];
	var regex = /\/Static\/(.*?)\/\$\$(.*)/;
	var regresult = regex.exec(cloudUrl);

	if (regresult && regresult.length == 3) {
		var item = regresult[2].split(',');
		_.map(item, function(n) {
			result.push(path.join(regresult[1], n));
		})
	}
	return result;
}

var judeUrl = function(cloudUrl, rePath) {
	if (_.endsWith(cloudUrl, rePath)) {
		return true;
	}
}

module.exports.CloudKeyCanRemove = function(cloudUrl, rePath) {
	//http://182.168.1.162:8081/Static/js/common/$$headJs.js,ua/ua.js
	if (judeUrl(cloudUrl, rePath)) {
		return true;
	}
	var cloudUrls = splitCloudUrl(cloudUrl);
	_.dropWhile(cloudUrls, function(n) {
		return judeUrl(cloudUrl, rePath);
	});
	return cloudUrls.length > 0;
}