var globalAppInfo = require('../../package.json');

module.exports = function(app){
	/**
	 * Index page.
	 */
	app.get('/', function(req, res) {
		var info = {
			name: globalAppInfo.name,
			description: globalAppInfo.description,
			version: globalAppInfo.version
		};
		
		if (req.accepts('html')) {
			res.render('index.html', {locals: {info:info}});
		} else if (req.accepts('json')) {
			res.send({info:info});
		} else {
			res.type('txt').send(
				'name: ' + info.name + '\n' +
				'description: ' + info.description + '\n' +
				'version: ' + info.version + '\n'
			);
		}
	});
};
