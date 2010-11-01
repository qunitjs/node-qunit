install: jscoverage argsparser runtests

jscoverage:
	cd ./deps/jscoverage/ && ./configure && make && install

argsparser:
	npm install ./deps/argsparser

runtests:
	./bin/runtests