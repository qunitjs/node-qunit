var code = process.argv[2],
    test = process.argv[3],
    qunit = require( "./qunit" ),
    path = require( "path" );

require.paths.push( path.join( process.env.PWD , path.dirname(process.env._) )  );

// make qunit api global
extend( global, qunit.api );

// require code 
extend( global, require( code.substr(0, code.length-3) ) );

// require test
require( test.substr(0, test.length-3)  );

qunit.begin();

function extend( target /* ,obj, obj */ ) {
    var args = arguments,
        i = 0,
        key;
    
    for ( ; i < args.length; ++i ) {
        for ( key in args[i] ) {
            target[key] = args[i][key];
        }            
    }  
          
    return target;    
}