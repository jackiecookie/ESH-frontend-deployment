var program = require('commander');

var version = require('./package.json').version;

program
	.version(version)
	.option('-f, --file <files>', '部署文件')
	.option('-o, --folder<folder>', '部署一个文件夹');

program.parse(process.argv);