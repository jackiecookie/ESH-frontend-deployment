var program = require('commander');

var version = require('./package.json').version;

var fileDeployment = require('./core/file-deployment');

program
	.version(version)
	.option('-f, --file <files>', '部署文件', fileDeployment)
	.option('-o, --folder<folder>', '部署一个文件夹');

program.parse(process.argv);