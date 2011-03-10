install:
	cd deps/jscoverage && ./configure && make

test:
	qunit -c ./lib/api.js -d testns1:sharedjs testns2:./test/filedeps/namespace.js ./test/filedeps/global.js -t ./test/api.js ./test/cli.js ./test/same.js

.PHONY: install test