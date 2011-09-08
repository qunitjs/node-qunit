install:
	cd deps/jscoverage && ./configure && make

test:
	qunit -c ./lib/testrunner.js -t ./test/testrunner.js --cov false

.PHONY: install test