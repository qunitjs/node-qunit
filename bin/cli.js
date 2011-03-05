#!/usr/bin/env node

var root = __dirname + "/..",
	args = require( root + "/deps/argsparser" ).parse(),
    qunit = require( root ),
    util = require( "util" ),    
    o = qunit.options,
    code, as = null, tests;

var help = ''
        + '\nUsage: cli [options] value (boolean value can be used)'
        + '\n'
        + '\nOptions:'
        + '\n -c, --code path to code you want to test'
        + '\n -a, --as variable name used to expose code module to tests'
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
            code = args[key];
            break;
        case "-a":
        case "--as":
            as = args[key];
            break;
        case "-t": 
        case "--tests":
            tests = args[key];
            break;
        case "-d": 
        case "--deps":
            o.deps = args[key];
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

qunit.run({ code: code, as: as, tests: tests });