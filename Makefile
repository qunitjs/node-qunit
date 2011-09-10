install:
	cd deps/jscoverage && ./configure && make

test:
	node ./test/testrunner.js

.PHONY: install test