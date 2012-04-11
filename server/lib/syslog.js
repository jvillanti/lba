var util = require('util'),
	winston = require('winston'),
	SysLogger = require('ain2'),
	syslog = new SysLogger();

var SyslogLogger = winston.transports.SyslogLogger = function (options) {
	// Name this logger
	this.name = 'syslogLogger';
	
	// Set the level from your options
	this.level = options.level || 'info';
	syslog.set(options);
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(SyslogLogger, winston.Transport);

SyslogLogger.prototype.log = function (level, msg, meta, callback) {
	if (meta) {
		msg += ' :' + util.inspect(meta);
	}
	syslog.send(msg, level);
	callback(null, true);
};