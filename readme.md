## This is a port of QUnit unit testing framework to nodejs

http://github.com/jquery/qunit

## Features
 * the simplest API of the world :)
 * 100% identical API for client and node (passing all unit tests from QUnit)
 * simple asynchronous testing
 * tests inside of one testfile run synchronous
 * tests from each file run in its own spawned node instance
 * usage via CLI or testrunner

## API
http://docs.jquery.com/QUnit

## Usage

### using testrunner
    
    var testrunner = require( "node-qunit/testrunner" );

    testrunner.run({
        code: "/path/to/your/code.js",
        test: "/path/to/your/tests.js"
    });

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

### using CLI
    node cli.js /path/to/your/code.js /path/to/your/tests.js

## Run tests
./bin/runtests

## TODO
 * make all tests work
 * add test coverage tool  
     