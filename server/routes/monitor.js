module.exports = function(app){
	/**
	 * Monitoring page.
	 */
	app.get('/monitor', function(req, res) {
		if (req.accepts('html')) {
			res.send('<html><body>ok</body></html>');
		} else if (req.accepts('json')) {
			res.send({status:'ok'});
		} else {
			res.type('txt').send('ok');
		}
	});
};
