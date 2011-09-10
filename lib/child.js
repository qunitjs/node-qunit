var path = require('path'),
    $ = require('sharedjs'),
    options = JSON.parse(process.argv[2]);
    
var currentModule = path.basename(options.code.path, '.js'), 
    currentTest;

// make qunit api global, like it is in the browser
$.extend(global, require('../deps/qunit/qunit/qunit'));

function load(res) {
    var requirePath = res.path.replace(/\.js$/, '');
    
    // test resource can define'namespace'to expose its exports as a named object
    if (res.namespace) {
        global[res.namespace] = require(requirePath);
    } else {
        $.extend(global, require(requirePath));
    }
}

// add paths to require
if (options.paths){
    require.paths.push.apply(require.paths, options.paths);
}

QUnit.testStart = function(test) {
    // currentTest is undefined while first test is not done yet
    currentTest = test.name;
    // use last module name if no module name defined
    currentModule = test.module || currentModule;
};

QUnit.log = function(data) {
    data.test = currentTest;
    data.module = currentModule;
    
    process.send({
        event: 'assertionDone',
        data: data
    });
};

QUnit.testDone = function(test) {
    // use last module name if no module name defined
    test.module = test.module || currentModule;
    
    process.send({
        event: 'testDone',
        data: test
    });
};

QUnit.done = function done(res) {
    // XXX don't know why, but qunit fires a lot of done callbacks,
    // only the last one has correct data #wtf
    clearTimeout(done.timeout);
    done.timeout = setTimeout(function() {
        process.send({
            event: 'done',
            data: res
        });        
    }, 300); 
};


// require deps
options.deps.forEach(load);
// require code
load(options.code);
// require tests
options.tests.forEach(load);

QUnit.begin();
