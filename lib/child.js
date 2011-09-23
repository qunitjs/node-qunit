var path = require('path'),
    fs = require('fs'),
    vm = require('vm'),    
    _ = require('underscore'),
    trace = require('tracejs').trace,
    options = JSON.parse(process.argv[2]);
    
var currentModule = path.basename(options.code.path, '.js'), 
    currentTest;

var qunitPath = __dirname + '/../deps/qunit/qunit/qunit.js',
    qunitCode = fs.readFileSync(qunitPath, 'utf-8'),
    sandbox = {
        require: require,
        exports: {},
        window: {setTimeout: setTimeout},
        console: console,
        clearTimeout: clearTimeout 
    };

vm.runInNewContext('(function(){'+ qunitCode +'}.call(window))', sandbox, qunitPath);
_.extend(global, sandbox.exports);

// make qunit api global, like it is in the browser
//_.extend(global, require('../deps/qunit/qunit/qunit'));

/**
 * Require a resource.
 * @param {Object} res
 */
function load(res) {
    var requirePath = res.path.replace(/\.js$/, '');

    // test resource can define'namespace'to expose its exports as a named object
    if (res.namespace) {
        global[res.namespace] = require(requirePath);
    } else {
        _.extend(global, require(requirePath));
    }
}

/**
 * Calculate coverage stats using bunker
 */
function calcCoverage() {
    
}

/**
 * Callback for each started test.
 * @param {Object} test
 */
QUnit.testStart(function(test) {
    // currentTest is undefined while first test is not done yet
    currentTest = test.name;
    // use last module name if no module name defined
    currentModule = test.module || currentModule;
});

/**
 * Callback for each assertion.
 * @param {Object} data
 */
QUnit.log(function(data) {
    data.test = currentTest;
    data.module = currentModule;
    
    process.send({
        event: 'assertionDone',
        data: data
    });
});

/**
 * Callback for one done test.
 * @param {Object} test
 */
QUnit.testDone(function(test) {
    // use last module name if no module name defined
    test.module = test.module || currentModule;
    
    process.send({
        event: 'testDone',
        data: test
    });
});

/**
 * Callback for all done tests in the file.
 * @param {Object} res
 */
QUnit.done(function done(res) {
    clearTimeout(done.timeout);
    done.timeout = setTimeout(function() {
        if (options.coverage) {
            res.coverage = calcCoverage();    
        }
        
        process.send({
            event: 'done',
            data: res
        });        
    }, 3000);
});


// require deps
options.deps.forEach(load);
// require code
load(options.code);
// require tests
options.tests.forEach(load);

/**
 * Provide better stack traces
 */
var error = console.error;
console.error = function(obj) {
    // log full stacktrace
    if (obj && obj.stack) {
        obj = trace(obj);
    }
    return error.apply(this, arguments);
};

QUnit.begin();
