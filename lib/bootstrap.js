var qunit = require( "./api" ),
    path = require( "path" ),
    util = require( "util" ),
    options = JSON.parse( process.argv[2] );

function requireTestResource(res) {
    // test resource must define .file or .module
    var requirePath = res.file ?
                      res.file.replace( /\.js$/, "" ) :
                      res.module,
        mod = {};
    // test resource can define .as to expose its exports as a named object
    if (res.as) {
        mod[res.as] = require( requirePath );
    } else {
        mod = require ( requirePath );
    }
    qunit.extend( global, mod );
}

// add paths to require
if ( options.paths ) {
    require.paths.push.apply( require.paths, options.paths );
}

// require deps
options.deps.forEach(function( dep ){
    requireTestResource( dep );
});

// require code
requireTestResource( options.code );

// require tests
options.tests.forEach(function( test ){
    require( test.replace( /\.js$/, "" ) );
});

if ( options.coverage ) {
    QUnit.done = function() {
        return {
            cov: _$jscoverage
        };
    };
}

QUnit.begin();