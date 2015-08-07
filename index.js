var program = require('commander');

var version = require('./package.json').version;

var fileDeployment = require('./core/file-deployment');

var ndir = require('ndir');

var path = require('path');



var fileinit = function(fileStr) {
	var files = fileStr.split('+');
	fileDeployment(files)
}


var dirInit = function(folder) {
	var filespara = [];
	var walker = ndir.walk(folder);
	walker.on('dir', function(dirpath, files) {
		for (var i = 0, l = files.length; i < l; i++) {
			var info = files[i];
			if (info[1].isFile()) {
				//评比差异，统一传入相对路径
				filespara.push(path.relative(process.cwd(), info[0]));
			}
		}
	});
	walker.on('error', function(err, errPath) {
		console.error('%s error: %s', errPath, err);
	});
	walker.on('end', function() {
		fileDeployment(filespara);
	});
}

program
	.version(version)
	.option('-f, --file <files>', '部署文件', fileinit)
	.option('-o, --folder<folder>', '部署一个文件夹', dirInit);

program.parse(process.argv);