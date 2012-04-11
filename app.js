#!/usr/bin/env node

var config = require('./config');

var express = require('express');
var cf = require('cloudfoundry');
var fs = require('fs');
var winston = require('winston');
var sprintf = require('sprintf').sprintf;
var RedisStore = require('connect-redis')(express);

var dateFormat = require('./server/lib/dateformat');

// Handy to be able to require() a JSON file
require.extensions[".json"] = function (m) {
	m.exports = JSON.parse(fs.readFileSync(m.filename));
};

// Handle uncaught exceptions
process.on('uncaughtException', function(err) {
	winston.error(err.toString(), err);
});

// Creat server
var app = express.createServer();
var cachePreventionKey = dateFormat(new Date(), 'yyyymmddHHMMss');

// Use EJS as template engine
app.register('.html', require('ejs'));

// Server configurations:
var maxAge = 0;
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
	maxAge = 31557600000;
	app.use(express.errorHandler());
	require('./server/lib/syslog');
	winston.setLevels(winston.config.syslog.levels);
	winston.add(winston.transports.SyslogLogger, config.syslog);
});
app.configure(function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		key: 'lba',
		secret: config.secret,
		store: new RedisStore({
			host: config.redis.credentials.hostname,
			port: config.redis.credentials.port,
			db: config.redis.credentials.db,
			pass: config.redis.credentials.password
		})
	}));
	app.set('views', __dirname + '/client');
	app.set('view engine', 'html');
	app.set('view options', { env: app.settings.env, layout: false });

	app.use(app.router);
	app.use(express.static(__dirname + '/client', { maxAge: maxAge }));
	app.use(function(req, res){
		if (req.accepts('html')) {
			res.status(404).send('<h1>Not found</h1>');
		} else if (req.accepts('json')) {
			res.send({error: 'Not found'});
		} else {
			res.type('txt').send('Not found');
		}
	});
});

app.helpers({
	sprintf: function() {
		return sprintf.apply(null, arguments);
	},
	getCachePrevetionKey: function() {
		return cachePreventionKey;
	}
});

app.dynamicHelpers({
	session: function(req){
		return req.session;
	}
});

/**
 * Error handle.
 */
app.error(function(err, req, res) {
	winston.error('500', err);
	if (req.accepts('html')) {
		res.status(500).send(err);
	} else if (req.accepts('json')) {
		res.send({error: err});
	} else {
		res.type('txt').send(err);
	}
});

// Register routes...
require('./server/routes/index')(app);
require('./server/routes/monitor')(app);

module.exports = app;

if (!module.parent) {
	app.listen(config.server.port);
	winston.info('App running in ' + app.settings.env + ' mode on port ' + config.server.port);
	if (cf.cloud) {
		winston.info('Did i told you that i was running on the cloud?');
	}
}
