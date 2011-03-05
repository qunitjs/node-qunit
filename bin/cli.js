#!/usr/bin/env node

var root = __dirname + "/..",
  args = require( root + "/deps/argsparser" ).parse(),
    qunit = require( root ),
    util = require( "util" ),
    o = qunit.options,
    code, tests;

/**
 * Parses a code or dependency argument, returning an object defining the
 * specified file path or module name. Any input ending in ".js" will be
 * treated as a file path, otherwise it will be treated as a module name.
 * The exports of the module will be exposed globally by default. To expose
 * exports as a named variable, prefix the resource with the desired variable
 * name followed by a colon.
 * This allows you to more accurately recreate browser usage of QUnit, for
 * tests which are portable between browser runtime environmemts and Node.js.
 */
function parseTestResource ( input ) {
    var parts = input.split( ":" ),
        requirePath = parts.pop(),
        resource = {};

    if ( /\.js$/.test( requirePath ) ) {
        resource.file = requirePath;
    } else {
        resource.module = requirePath;
    }

    if ( parts.length === 1 ) {
        resource.as = parts[0];
    }

    return resource;
}

var help = ''
        + '\nUsage: cli [options] value (boolean value can be used)'
        + '\n'
        + '\nOptions:'
        + '\n -c, --code path to code you want to test'
        + '\n -t, --tests path to tests (space separated)'
        + '\n -d, --deps dependency paths - files required before code (space separated)'
        + '\n -o, --errors-only report only errors'
        + '\n -e, --error-stack display error stack'
        + '\n -s, --summary display summary report'
        + '\n -C, --cov create tests coverage report'
        + '\n -p, --paths, add paths to require.paths array'
        + '\n -t, --coverage-tmp-dir change temp dir, which is used for jscoverage tool'
        + '\n -h, --help show this help'
        + '\n';

for ( var key in args ) {
    switch( key ) {
        case "-c":
        case "--code":
            code = parseTestResource(args[key]);
            break;
        case "-t":
        case "--tests":
            // it's assumed that tests arguments will be file paths whose
            // contents are to be made global. This is consistent with use
            // of QUnit in browsers.
            tests = args[key];
            break;
        case "-d":
        case "--deps":
            var deps = args[key];
            if ( !Array.isArray ( deps ) ) {
                deps = [deps];
            }
            o.deps = deps.map(parseTestResource);
            break;
        case "-o":
        case "--errors-only":
            o.errorsOnly = args[key];
            break;
        case "-e":
        case "--error-stack":
            o.errorStack = args[key];
            break;
        case "-s":
        case "--summary":
            o.summary = args[key];
            break;
        case "--cov":
            o.coverage = args[key];
            break;
        case "-p":
        case "--paths":
            o.paths = args[key];
            break;
        case "--tmp":
            o.coverageTmpDir = args[key];
            break;
        case "-h":
        case "-?":
        case "--help":
            util.print( help );
            return;
    }
}

qunit.run({ code: code, tests: tests });