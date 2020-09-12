[![Build Status](https://travis-ci.com/qunitjs/node-qunit.svg?branch=master)](https://travis-ci.com/qunitjs/node-qunit) [![npm](https://img.shields.io/npm/v/node-qunit.svg?style=flat)](https://www.npmjs.com/package/node-qunit)

## QUnit testing framework for Node.js

https://qunitjs.com

https://github.com/qunitjs/qunit

### Features

- cli
- testrunner api
- test coverage via istanbul
- tests inside of one testfile run synchronous, but every testfile runs parallel
- tests from each file run in its own spawned node process
- same API for client and server side code (original QUnit is used)
- the simplest API of the world, especially for asynchronous testing
- you can write tests in TDD or BDD style depending on your task and test type
- you can run the same tests in browser if there is no dependencies to node
- generators support

### Installation

```bash
$ npm i node-qunit
```

#### Package Name Up to 1.0.0

Up until version 1.0.0, this package was published under the name `qunit`. That
name is now used by the official QUnit package and CLI, and this package will be
published as `node-qunit` from version 1.0.0 onward.

Additionally, prior to 1.0.0, the `node-qunit` package was a different project
that was deprecated and now lives under the name [`qnit`](https://www.npmjs.com/package/qnit).

### API

    https://api.qunitjs.com

#### The only exception

```javascript
// Separate tests into modules.
// Use `QUnit` namespace, because `module` is reserved for node.
QUnit.module(name, lifecycle)
```

### Usage

#### Command line

Read full cli api doc using "--help" or "-h":

```bash
$ qunit -h

$ qunit -c ./code.js -t ./tests.js
```

By default, code and dependencies are added to the global scope. To specify
requiring them into a namespace object, prefix the path or module name with the
variable name to be used for the namespace object, followed by a colon:

```bash
$ qunit -c code:./code.js -d utils:utilmodule -t ./time.js
```

#### via api

```javascript
var testrunner = require("node-qunit");

// Defaults:
{
    // logging options
    log: {

        // log assertions overview
        assertions: true,

        // log expected and actual values for failed tests
        errors: true,

        // log tests overview
        tests: true,

        // log summary
        summary: true,

        // log global summary (all files)
        globalSummary: true,

        // log coverage
        coverage: true,

        // log global coverage (all files)
        globalCoverage: true,

        // log currently testing code file
        testing: true
    },

    // run test coverage tool
    coverage: false,

    // define dependencies, which are required then before code
    deps: null,

    // define namespace your code will be attached to on global['your namespace']
    namespace: null,

    // max amount of ms child can be blocked, after that we assume running an infinite loop
    maxBlockDuration: 2000
}
```

```javascript
// change any option for all tests globally
testrunner.options.optionName = value;

// or use setup function
testrunner.setup({
    log: {
        summary: true
    }
});


// one code and tests file
testrunner.run({
    code: "/path/to/your/code.js",
    tests: "/path/to/your/tests.js"
}, callback);

// require code into a namespace object, rather than globally
testrunner.run({
    code: {path: "/path/to/your/code.js", namespace: "code"},
    tests: "/path/to/your/tests.js"
}, callback);

// one code and multiple tests file
testrunner.run({
    code: "/path/to/your/code.js",
    tests: ["/path/to/your/tests.js", "/path/to/your/tests1.js"]
}, callback);

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
], callback);

// using testrunner callback
testrunner.run({
    code: "/path/to/your/code.js",
    tests: "/path/to/your/tests.js"
}, function(err, report) {
    console.dir(report);
});

// specify dependency
testrunner.run({
    deps: "/path/to/your/dependency.js",
    code: "/path/to/your/code.js",
    tests: "/path/to/your/tests.js"
}, callback);

// dependencies can be modules or files
testrunner.run({
    deps: "modulename",
    code: "/path/to/your/code.js",
    tests: "/path/to/your/tests.js"
}, callback);

// dependencies can required into a namespace object
testrunner.run({
    deps: {path: "utilmodule", namespace: "utils"},
    code: "/path/to/your/code.js",
    tests: "/path/to/your/tests.js"
}, callback);

// specify multiple dependencies
testrunner.run({
    deps: ["/path/to/your/dependency1.js", "/path/to/your/dependency2.js"],
    code: "/path/to/your/code.js",
    tests: "/path/to/your/tests.js"
}, callback);
```

### Writing tests

QUnit API and code which have to be tested are already loaded and attached to the global context.

Some tests examples

```javascript
test("a basic test example", function (assert) {
    assert.ok(true, "this test is fine");
    var value = "hello";
    assert.equal("hello", value, "We expect value to be hello");
});

QUnit.module("Module A");

test("first test within module", function (assert) {
    assert.ok(true, "a dummy");
});

test("second test within module", function (assert) {
    assert.ok(true, "dummy 1 of 2");
    assert.ok(true, "dummy 2 of 2");
});

QUnit.module("Module B", {
    setup: function () {
        // do some initial stuff before every test for this module
    },
    teardown: function () {
        // do some stuff after every test for this module
    }
});

test("some other test", function (assert) {
    assert.expect(2);
    assert.equal(true, false, "failing test");
    assert.equal(true, true, "passing test");
});

QUnit.module("Module C", {
    setup: function() {
        // setup a shared environment for each test
        this.options = { test: 123 };
    }
});

test("this test is using shared environment", function (assert) {
    assert.deepEqual({ test: 123 }, this.options, "passing test");
});

test("this is an async test example", function (assert) {
    var done = assert.stop();
    assert.expect(2);
    setTimeout(function () {
        assert.ok(true, "finished async test");
        assert.strictEqual(true, true, "Strict equal assertion uses ===");
        done();
    }, 100);
});
```

### Generators support

```javascript
test("my async test with generators", function* (assert) {
    var data = yield asyncFn();
    assert.equal(data, {a: 1}, 'generators work');
});
```

### Run tests

```bash
$ npm it
```

### Coverage

Code coverage via Istanbul.

To utilize, install `istanbul` and set option `coverage: true` or give a path where to store report `coverage: {dir: "coverage/path"}` or pass `--cov` parameter in the shell.

To specify the format of coverage report pass reporters array to the coverage options: `coverage: {reporters: ['lcov', 'json']}` (default)

Coverage calculations based on code and tests passed to `node-qunit`.
