install: jscoverage testrunner
	
jscoverage:
	cd deps/jscoverage && ./configure && make

testrunner:
	./bin/testrunner
