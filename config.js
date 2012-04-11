var cf = require("cloudfoundry");

/** Basic configuration */
module.exports = {
	/** Server options */
	server: {
		/** Server port */
		port: cf.port || process.env.APP_PORT || 8081
	},
	
	/** MongoDB options */
	mongo: cf.mongodb['mongo-lba'] || {
		credentials: {
			hostname: 'localhost',
			port: 27017,
			username: false, // or a String if auth is used
			password: '',
			db: 'lba'
		}
	},
	
	/** Redis options */
	redis: cf.redis['redis-lba'] || {
		credentials: {
			hostname: 'localhost',
			port: 6379,
			password: false, // or a String if auth is used
			db: 9
		}
	},
	
	/** Syslog options */
	syslog: {
		tag: 'lba'
	},
	
	/** Secret use to crypt sessions */
	secret: process.env.APP_SECRET || 'lbaS3cr3T!'
};