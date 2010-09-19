## This is a port of QUnit unit testing framework to nodejs

http://github.com/jquery/qunit

## Features
 * the simplest API of the world :)
 * 100% identical API for client and node (passing all unit tests from QUnit)
 * simple asynchronous testing
 * tests inside of one testfile run synchronous, but every testfile runs async
 * tests from each file run in its own spawned node instance
 * usage via CLI or testrunner

## API
http://docs.jquery.com/QUnit

## Usage

### testrunner
    
    var testrunner = require( "node-qunit/testrunner" );
    
    
    
    // set it to true if you want to report only errors
    testrunner.options.errorsOnly = false;
    // set it to false if you want to get error stack in report     
    testrunner.options.errorStack = true;
    // print a summary about all tested stuff after finish
    testrunner.options.summary = true;
    
    // one test file
    testrunner.run({
        code: "/path/to/your/code.js",
        test: "/path/to/your/tests.js"
    });
    
    // array of test files
    testrunner.run([
        {
            code: "/path/to/your/code.js",
            test: "/path/to/your/tests.js"
        },
        {
            code: "/path/to/your/code.js",
            test: "/path/to/your/tests.js"
        }    
    ]);
    
    // using testrunner callback
    testrunner.run({
        code: "/path/to/your/code.js",
        test: "/path/to/your/tests.js"
    }, function( report ) {
        console.dir(report);
    });    
    
### Writing tests

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
    
    testAsync("this is an async test example", 1, function() {
        setTimeout(function() {
            ok(true, "finished async test");
            start();
        }, 100);
    });
    
### CLI
$ node cli.js /path/to/your/code.js /path/to/your/tests.js

## Run tests
$ ./bin/runtests   