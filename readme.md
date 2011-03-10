## This is a port of QUnit unit testing framework to nodejs

http://github.com/jquery/qunit

## Features
 * the simplest API of the world :)
 * 100% identical API for client and node (passing all unit tests from QUnit)
 * simple asynchronous testing
 * tests inside of one testfile run synchronous, but every testfile runs async
 * tests from each file run in its own spawned node instance
 * usage via CLI or testrunner
 * uses the assert module
 * test coverage via http://siliconforks.com/jscoverage

## Installation
    npm install qunit

## API

http://docs.jquery.com/QUnit

### Setup
    // Add a test to run.
    test( name, expected, test )

    // Add an asynchronous test to run. The test must include a call to start().
    asyncTest( name, expected, test )

    // Specify how many assertions are expected to run within a test.
    expect( amount );

    // Separate tests into modules.
    module( name, lifecycle )

### Assertions
    // A boolean assertion, equivalent to JUnit's assertTrue. Passes if the first argument is truthy.
    ok( state, message )

    // A comparison assertion, equivalent to JUnit's assertEquals. Uses "==".
    equals( actual, expected, message )

    // A comparison assertion. Uses "===".
    strictEqual( actual, expected, message )

    // A deep recursive comparison assertion, working on primitive types, arrays and objects.
    same( actual, expected, message )

    // Assertion to test if a callback throws an exception when run.
    raises( actual, message )

### Asynchronous Testing
    // Start running tests again after the testrunner was stopped.
    start()

    // Stop the testrunner to wait to async tests to run. Call start() to continue.
    stop( timeout )

## Usage

### Command line

Some usage examples, read full cli api doc using "--help":

    $ qunit -h

    $ qunit -c ./code.js -t ./tests.js

    $ qunit -c ./code.js -t ./tests.js -p /path/for/require /path1/for/require --cov false

By default, code and dependencies are added to the global scope. To specify
requiring them into a namespace object, prefix the path or module name with the
variable name to be used for the namespace object, followed by a colon:

    $ qunit -c code:./code.js -d utils:utilmodule -r ./time.js

### via api

    var testrunner = require( "qunit" );

    Defaults:

    {
        errorsOnly: false, // set it to true if you want to report only errors
        errorStack: true, // set it to false if you want to get error stack in report
        summary: true, // print a summary about all tested stuff after finish
        coverage: true, // display coverage
        paths: null // add paths to require of test environment
    }

    // to change any option - change it :)

    testrunner.options.optionName = value;

    // one code and tests file
    testrunner.run({
        code: "/path/to/your/code.js",
        tests: "/path/to/your/tests.js"
    });

    // require code into a namespace object, rather than globally
    testrunner.run({
        code: {path: "/path/to/your/code.js", namespace: "code"},
        tests: "/path/to/your/tests.js"
    });

    // one code and multiple tests file
    testrunner.run({
        code: "/path/to/your/code.js",
        tests: ["/path/to/your/tests.js", "/path/to/your/tests1.js"]
    });

    // array of code and test files
    testrunner.run([
        {
            code: "/path/to/your/code.js",
            tests: "/path/to/your/tests.js"
        },
        {
            code: "/path/to/your/code.js",
            tests: "/path/to/your/tests.js"
        }
    ]);

    // using testrunner callback
    testrunner.run({
        code: "/path/to/your/code.js",
        tests: "/path/to/your/tests.js"
    }, function( report ) {
        console.dir(report);
    });

    // specify dependency
    testrunner.run({
        deps: "/path/to/your/dependency.js",
        code: "/path/to/your/code.js",
        tests: "/path/to/your/tests.js"
    });

    // dependencies can be modules or files
    testrunner.run({
        deps: "modulename",
        code: "/path/to/your/code.js",
        tests: "/path/to/your/tests.js"
    });

    // dependencies can required into a namespace object
    testrunner.run({
        deps: {path: "utilmodule", namespace: "utils"},
        code: "/path/to/your/code.js",
        tests: "/path/to/your/tests.js"
    });

    // specify multiple dependencies
    testrunner.run({
        deps: ["/path/to/your/dependency1.js", "/path/to/your/dependency2.js"],
        code: "/path/to/your/code.js",
        tests: "/path/to/your/tests.js"
    });

## Debbugging
Use stderr if you want to debug something  while running via quni.
    require("util").debug("This will not brake qunit report");

## Writing tests

QUnit API and code which have to be tested are already loaded and attached to the global context.

Because nodejs modules reserved "module" namespace we have to redefine it from QUnit namespace.

    module = QUnit.module;

Basically QUnit API can ba accessed directly from global object or optional via "QUnit" object.

    QUnit.test;

Some tests examples

    test("a basic test example", function() {
      ok( true, "this test is fine" );
      var value = "hello";
      equals( "hello", value, "We expect value to be hello" );
    });

    module("Module A");

    test("first test within module", 1, function() {
      ok( true, "all pass" );
    });

    test("second test within module", 2, function() {
      ok( true, "all pass" );
    });

    module("Module B", {
        setup: function() {
            // do some initial stuff before every test for this module
        },
        teardown: function() {
            // do some stuff after every test for this module
        }
    });

    test("some other test", function() {
      expect(2);
      equals( true, false, "failing test" );
      equals( true, true, "passing test" );
    });

    module("Module C", {
        setup: function() {
            // setup a shared environment for each test
            this.options = {test: 123};
        }
    });

    test("this test is using shared environment", 1, function() {
      same( {test:123}, this.options, "passing test" );
    });

    asyncTest("this is an async test example", 2, function() {
        setTimeout(function() {
            ok(true, "finished async test");
            strictEqual( true, true, "Strict equal assertion uses ===" );
            start();
        }, 100);
    });

## Run tests

    $ make test

## JSCoverage

Using JSCoverage 0.3.1 (from the ubuntu universe repositories) resulted
in a "jscoverage: unknown file type" error.  Updating to the JSCoverage
0.5.1 from http://siliconforks.com/jscoverage/ resolves this issue.
