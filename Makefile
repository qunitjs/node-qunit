install: jscoverage parseopts runtests

jscoverage:
	./deps/jscoverage/configure && ./deps/jscoverage/make 

parseopts:
	npm install ./deps/parseopts

submodule:
	git submodule update --init

runtests:
	./bin/runtests