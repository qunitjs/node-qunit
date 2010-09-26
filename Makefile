install: jscoverage argsparser runtests

jscoverage:
	cd ./deps/jscoverage/ && ./configure && make 

argsparser:
	npm install ./deps/argsparser

runtests:
	./bin/runtests