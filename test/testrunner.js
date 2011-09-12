var a = require('assert'),
    fixtures = __dirname + '/fixtures',
    tr = require('../lib/testrunner'),
    log = require('../lib/log');

tr.options.summary = false;

var tests = [];

/**
 * Mini utility to run tests sync
 */
var next = start = (function() {
    var current = 0;
    
    return function() {
        if (tests[current]) {
            log.reset();
            tests[current]();
        } else {
            console.log(tests.length + ' tests done');
        } 
        current++;
    };
}());

tests.push(function() {
    tr.run({
        code: fixtures + '/testrunner-code.js',
        tests: fixtures + '/testrunner-tests.js',
        coverage: false
    }, function(res) {
          var stat = { 
                  files: 1,
                  tests: 2,
                  assertions: 5,
                  failed: 2,
                  passed: 3 
              };
              
        a.deepEqual(stat, res, 'base testrunner test works');
        next();
    });
});

tests.push(function() {
    tr.run({
        code: fixtures + '/child-code-global.js',
        tests: fixtures + '/child-tests-global.js',
        coverage: false
    }, function(res) {
          var stat = { 
                  files: 1,
                  tests: 1,
                  assertions: 2,
                  failed: 0,
                  passed: 2 
              };
              
        a.deepEqual(stat, res, 'attaching code to global works');
        next();
    });
});    

tests.push(function() {
    tr.run({
        code: {
            path: fixtures + '/child-code-namespace.js',
            namespace: 'testns'
        },
        tests: fixtures + '/child-tests-namespace.js',
        coverage: false,
    }, function(res) {
          var stat = { 
                  files: 1,
                  tests: 1,
                  assertions: 3,
                  failed: 0,
                  passed: 3 
              };
              
        a.deepEqual(stat, res, 'attaching code to specified namespace works');
        next();
    });
});

start();

