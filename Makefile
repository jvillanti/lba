VERSION=1.0
DATE=$(shell date)
MAIN_STYLE_LESS = ./client/less/main.less
MAIN_STYLE_MIN = ./client/css/main.min.css
MAIN_STYLE = ./client/css/main.css
LESS_COMPRESSOR ?= `which lessc`
UGLIFY_JS ?= `which uglifyjs`
NPM ?= `which npm`
VMC ?= `which vmc`

install: css
	@@if test ! -z ${NPM}; then \
		npm install; \
		echo "Project dependencies successfully installed! - `date`"; \
	else \
		echo "You must have the NPM installed in order to build this project."; \
	fi

deploy:
	@@if test ! -z ${VMC}; then \
		vmc update lba; \
		echo "Project deployed! - `date`"; \
	else \
		echo "You must have the VMC installed in order to build this project."; \
	fi

clean:
	rm -f ${MAIN_STYLE}
	rm -f ${MAIN_STYLE_MIN}
	rm -rf node_modules

css:
	@@if test ! -z ${LESS_COMPRESSOR}; then \
		lessc ${MAIN_STYLE_LESS} > ${MAIN_STYLE}; \
		lessc ${MAIN_STYLE_LESS} > ${MAIN_STYLE_MIN} --compress; \
		echo "Main style successfully built! - `date`"; \
	else \
		echo "You must have the LESS compiler installed in order to build this project."; \
		echo "You can install it by running: npm install less -g"; \
	fi

js:
	@@if test ! -z ${UGLIFY_JS}; then \
		#uglifyjs -o client/js/app.min.js client/js/src/app.js;
		echo "Javascripts successfully minifies! - `date`"; \
	else \
		echo "You must have the UGLIFYJS minifier installed in order to minify project's js."; \
		echo "You can install it by running: npm install uglify-js -g"; \
	fi

