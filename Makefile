install:
	cd deps/jscoverage && ./configure && make

test:
	qunit -c ./lib/api.js -t ./test/api.js ./test/same.js

.PHONY: install test