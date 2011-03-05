var qunit = require( "./api" ),
    path = require( "path" ),
    util = require( "util" ),
    options = JSON.parse( process.argv[2] );

// add paths to require
if ( options.paths ) {
    require.paths.push.apply( require.paths, options.paths );    
}

// require deps
options.deps.forEach(function( file ){
    qunit.extend( global, require( file.replace( /\.js$/, "" ) ) );
});

// require code
var code = options.code.replace( /\.js$/, "" );
var mod = {};
if (options.as !== null) {
    // expose module as the given variable name
    mod[options.as] = require( code );
} else {
    // expose the module exports directly
    mod = require( code );
}
qunit.extend( global, mod );

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