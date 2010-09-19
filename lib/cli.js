var code = process.argv[2],
    test = process.argv[3],
    qunit = require( "./qunit" ),
    path = require( "path" );

require.paths.push( path.join( process.env.PWD , path.dirname(process.env._) )  );

// make QUnit global
global.QUnit = qunit.QUnit;

// make qunit api global
qunit.extend( global, QUnit.api );


// require code 
qunit.extend( global, require( code.substr(0, code.length-3) ) );

// require test
require( test.substr(0, test.length-3)  );

QUnit.begin();