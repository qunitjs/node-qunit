var qunit = require( "./qunit" ),
    path = require( "path" ),
    util = require( "util" ),
    options = JSON.parse( process.argv[2] );

// add paths to require
if ( options.paths ) {
    require.paths.push.apply( require.paths, options.paths );    
}

// require code
qunit.extend( global, require( options.code.replace( /\.js$/, "" ) ) );

// require tests
options.tests.forEach(function( test ){
    require( test.replace( /\.js$/, "" ) );
});

if ( options.coverage ) {
    QUnit.done = function() {
        util.print(
            JSON.stringify({
                cov: _$jscoverage
            }) + "\n"    
        );
    };  
}

QUnit.begin();