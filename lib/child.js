var QUnit = require('qunit'),
    path = require('path'),
    _ = require('underscore'),
    trace = require('tracejs').trace,
    coverage = require('./coverage'),
    generators = require('./generators'),
    co = require('co');

// cycle.js: This file contains two functions, JSON.decycle and JSON.retrocycle,
// which make it possible to encode cyclical structures and dags in JSON, and to
// then recover them. JSONPath is used to represent the links.
// http://GOESSNER.net/articles/JsonPath/
require('../support/json/cycle');

var options = JSON.parse(process.argv.pop()),
    currentModule = path.basename(options.code.path, '.js');

// send ping messages to when child is blocked.
// after I sent the first ping, testrunner will start to except the next ping
// within maxBlockDuration, otherwise this process will be killed
process.send({event: 'ping'});
setInterval(function() {
    process.send({event: 'ping'});
}, Math.floor(options.maxBlockDuration / 2));

process.on('uncaughtException', function(err) {
    if (QUnit.config.current) {
        QUnit.assert.ok(false, 'Test threw unexpected exception: ' + err.message);
    }
    process.send({
        event: 'uncaughtException',
        data: {
            message: err.message,
            stack: err.stack
        }
    });
});

// make qunit api global, like it is in the browser
_.extend(global, QUnit);

// as well as the QUnit variable itself
global.QUnit = QUnit;

/**
 * Require a resource.
 * @param {Object} res
 */
function _require(res, addToGlobal) {
    var exports = require(res.path.replace(/\.js$/, ''));

    if (addToGlobal) {
        // resource can define 'namespace' to expose its exports as a named object
        if (res.namespace) {
            global[res.namespace] = exports;
        } else {
            _.extend(global, exports);
        }
    }
}

/**
 * Callback for each started test.
 * @param {Object} test
 */
QUnit.testStart(function(test) {
    // use last module name if no module name defined
    currentModule = test.module || currentModule;
});

/**
 * Callback for each assertion.
 * @param {Object} data
 */
QUnit.log(function(data) {
    data.test = QUnit.config.current.testName;
    data.module = currentModule;
    process.send({
        event: 'assertionDone',
        data: JSON.decycle(data)
    });
});

/**
 * Callback for one done test.
 * @param {Object} test
 */
QUnit.testDone(function(data) {
    // use last module name if no module name defined
    data.module = data.module || currentModule;
    process.send({
        event: 'testDone',
        data: data
    });
});

/**
 * Callback for all done tests in the file.
 * @param {Object} res
 */
QUnit.done(_.debounce(function(data) {
    data.coverage = global.__coverage__;

    process.send({
        event: 'done',
        data: data
    });
}, 1000));

var test = QUnit.test;

/**
 * Support generators.
 */
global.test = QUnit.test = function(testName, callback) {
    var fn;

    if (generators.isGeneratorFn(callback)) {
        fn = function(assert) {
            var done = assert.async();
            co.wrap(callback).call(this, assert).then(function() {
                done();
            }).catch(function (err) {
                console.log(err.stack);
                done();
            });
        };
    } else {
        fn = callback;
    }

    return test.call(this, testName, fn);
};

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

if (options.coverage) {
    coverage.instrument(options);
}

// require deps
options.deps.forEach(function(dep) {
    _require(dep, true);
});

// require code
_require(options.code, true);

// require tests
options.tests.forEach(function(test) {
    _require(test, false);
});

QUnit.load();
