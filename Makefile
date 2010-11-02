install: jscoverage argsparser testrunner

jscoverage:
	cd ./deps/jscoverage/ && ./configure && make && install jscoverage /usr/local/bin

argsparser:
	npm install ./deps/argsparser

testrunner:
	./bin/testrunner