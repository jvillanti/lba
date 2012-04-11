# LBA

## Installation guide
### Prerequisites

* [git](http://git-scm.com/)
* [nodejs](http://nodejs.org/) v0.6.6
* [mongodb](http://www.mongodb.org/)
* [redis](http://redis.io/)

#### Install Git, Python, Redis and MongoDB (on Debian)

        aptitude install git redis-server mongodb

Note: Redis is used to store the sessions. Minimal required version is 2.2.
So on debian sqeeze you have to activate and use backports:

1. Add the following line to /etc/apt/sources.list:

                deb http://backports.debian.org/debian-backports squeeze-backports main

2. Update your local package lists:

                sudo aptitude update

3. Install redis-server with:

                sudo aptitude -t squeeze-backports install redis-server

#### Install Node.JS

See following installation procedure : [https://github.com/joyent/node/wiki/Installation](https://github.com/joyent/node/wiki/Installation)

### Install Web Site

        cd ~/local/var/lib
        git clone git@github.com:ncarlier/lba.git
        git submodule init
        cd lba
        make

### Run (without CloudFoundry)

        #!/bin/sh
        # Optional ENV (default: development)
        export NODE_ENV=production
        # Optional PORT (default: 8081)
        export APP_PORT=8081

        node app.js 2>&1 >> bm.log

### Deploy on CloudFoundry

        #!/bin/sh
        vmc env-add lba NODE_ENV=production
        make deploy
