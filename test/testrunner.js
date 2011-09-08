var fixtures = __dirname + '/fixtures';

test("run method", function() {
    stop()
    run({
        code: fixtures + '/testrunner-code.js',
        tests: fixtures + '/testrunner-tests.js',
        coverage: false
    }, function(res) {
        ok(true, 'assertion');
        start();
    });
});
