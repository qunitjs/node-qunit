var qunit = require( "./api" ),
    path = require( "path" ),
    util = require( "util" ),
    $ = require('sharedjs'),
    options = JSON.parse( process.argv[2] );

function load(res) {
    var requirePath = res.path.replace( /\.js$/, "" );
    
    // test resource can define "namespace" to expose its exports as a named object
    if (res.namespace) {
        global[res.namespace] = require(requirePath);
    } else {
        $.extend(global, require(requirePath));
    }
}

// add paths to require
if ( options.paths ) {
    require.paths.push.apply( require.paths, options.paths );
}

// require deps
options.deps.forEach(load);

// require code
load(options.code);

// require tests
options.tests.forEach(load);

QUnit.done = function(results) {
    if ( options.coverage ) {
        results.push({
            cov: _$jscoverage
        });
    }
    
    util.print( JSON.stringify(results) );
};

QUnit.begin();
