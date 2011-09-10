var a = require('assert'),
    fixtures = __dirname + '/fixtures',
    tr = require('../lib/testrunner');

tr.options.summary = false;

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
          
    a.deepEqual(stat, res, 'stats are correct');
});

console.log('All tests done');
