install: jscoverage argsparser testrunner
	
jscoverage:
	cd deps/jscoverage && ./configure && make
	
argsparser:
	npm install ./deps/argsparser

testrunner:
	./bin/testrunner
