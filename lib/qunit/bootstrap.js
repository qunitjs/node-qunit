var qunit = require( "./qunit" ),
    path = require( "path" ),
    sys = require( "sys" ),
    options = JSON.parse( process.argv[2] );

// add paths to require
if ( options.paths ) {
    require.paths.push.apply( require.paths, options.paths );    
}

// require code
qunit.extend( global, require( options.code ) );

// require tests
options.tests.forEach(function( test ){
    require( test );
});

if ( options.coverage ) {
    QUnit.done = function() {
        sys.print(
            JSON.stringify({
                cov: _$jscoverage
            }) + "\n"    
        );
    };  
}

QUnit.begin();