module.exports = {
	GetContentTypeByExtname: function(extname) {
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
}