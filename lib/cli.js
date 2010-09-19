var code = process.argv[2],
    test = process.argv[3],
    paths = process.argv[4],
    qunit = require( "./qunit" ),
    path = require( "path" );

// add paths to require
paths && require.paths.push.apply( require.paths, paths.split( "," ) );

// make QUnit global
global.QUnit = qunit.QUnit;

// make qunit api global
qunit.extend( global, QUnit.api );

// require code 
qunit.extend( global, require( code.substr(0, code.length-3) ) );

// require test
require( test.substr(0, test.length-3)  );

QUnit.begin();