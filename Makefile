PREFIX ?= /usr/local
JSCOV = deps/jscoverage/node-jscoverage

install: jscoverage argsparser testrunner
	
jscoverage: make-jscov
	install $(JSCOV) $(PREFIX)/bin

make-jscov:
	cd deps/jscoverage && ./configure && make && mv jscoverage node-jscoverage
	
argsparser:
	npm install ./deps/argsparser

testrunner:
	./bin/testrunner
