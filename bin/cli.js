#!/usr/bin/env node

var root = __dirname + "/..",
    args = require("argsparser").parse(),
    qunit = require( root ),
    util = require( "util" ),
    o = qunit.options,
    code, tests;

/**
 * Parses a code or dependency argument, returning an object defining the
 * specified file path or/and module name.
 * The exports of the module will be exposed globally by default. To expose
 * exports as a named variable, prefix the resource with the desired variable
 * name followed by a colon.
 * This allows you to more accurately recreate browser usage of QUnit, for
 * tests which are portable between browser runtime environmemts and Node.js.
 * @param {string} path to file or module name to require.
 * @return {Object} resource
 */
function parsePath( path ) {
    var parts = path.split( ":" ),
        resource = {
            path: path
        };

    if ( parts.length === 2 ) {
        resource.namespace = parts[0];
        resource.path = parts[1];
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
        + '\n --cov create tests coverage report'
        + '\n -p, --paths, add paths to require.paths array'
        + '\n --tmp change temp dir, which is used for jscoverage tool'
        + '\n -h, --help show this help'
        + '\n';

for ( var key in args ) {
    switch( key ) {
        case "-c":
        case "--code":
            code = parsePath(args[key]);
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
            o.deps = args[key];
            if ( !Array.isArray ( o.deps ) ) {
                o.deps = [o.deps];
            }
            o.deps = o.deps.map(parsePath);
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