var sys = require( "sys" ),
    assert = require( "assert" );

var options = exports.options = {
        errorsOnly: false,
        stack: true
    };
    
var api = exports.api = {},
    undefined,
    pause = false,
    queue = [],
    test,
    module;

// for the case api properties will be overwritten by tested module
api.QUnit = api;

exports.begin = function() {
    if ( queue.length <= 0 ) {
        throw new Error( "There are no tests defined" );
    }
    
    api.start();    
};

api.module = function( name, opts ) {
    module = {
        name: name,
        opts: opts
    };

    return this;
};

api.test = function( name, expect, fn, async ) {

    if ( typeof name !== "string" ) {
        throw new Error( "Test name should be the first parameter" );
    }
    
    if ( typeof expect === "function" ) {
        fn = expect;
        expect = 0;
    }
    
    if ( typeof fn !== "function" ) {
        throw new Error( "No test function passed" );
    }
    
    queue.push({
        name: name,
        module: module,
        fn: fn,
        expected: expect,
        done: 0,
        async: async    
    });

    return this;
};

api.asyncTest = function( name, expect, fn ) {
    api.test( name, expect, fn, true );
    return this;
};

api.start = function() {
    pause = false;
    testDone();
    run();
    return this;
};

api.stop = function() {
    pause = true;
    return this;
};

api.expect = function( amount ) {
    test.expected = amount;
    return this;
};    

api.ok = function( value, message ) {
    test.done++;
    var error = false;
    
    try {
        assert.ok( value );
    } catch (err) {
        error = err;
    }
    
    log( error, {
        module: module.name,
        name: test.name,
        message: message
    }); 
    
    return this;
};    
    
api.equals = function( actual, expected, message ) {
    test.done++;
    
    var error = false;
    
    try {
        assert.equal( actual, expected );
    } catch( err ) {
        error = err;
    }
    
    log( error, {
        module: module.name,
        name: test.name,
        message: message 
    });   

    return this;
};

api.same = function( actual, expected, message ) {
    test.done++;
    
    var error = false;
    
    try {
        assert.deepEqual( actual, expected );
    } catch( err ) {
        error = err;
    }
    
    log( error, {
        module: module.name,
        name: test.name,
        message: message 
    });  

    return this;
};

function run() {

    test = queue.shift();
    module = test.module;
        
    if ( module.opts && module.opts.setup ) {
        module.opts.setup();
    }
    
    // run the test
    test.fn();
    
    if ( test.async ) {
        api.stop();
    } else {
        testDone();
    }
    
    if ( !pause && queue.length > 0 ) {
        run();
    }
}

function testDone() {
    
    if ( !test || !module ) {
        return;
    }
    
    if ( module.opts && module.opts.teardown ) {
        module.opts.teardown();
    }    
    
    // check if expected assertions count is correct
    if ( test.expected !== test.done ) {
        log( true, {
            name: test.name,
            module: module.name,
            message: "Expected " + test.expected + " test.assertions, but " + test.done + " were run" 
        });
    }    
}

function format( f, str ) {
    switch ( f ) {
        case "red":
            return "\033[31m" + str + "\033[39m";
        case "green":
            return "\033[32m" + str + "\033[39m";
        case "bold":
            return "\033[1m" + str + "\033[22m";   
    }
}

function log( error, obj ) {
    var descr = "[" + (obj.module ? obj.module +": " : "") + obj.name +"] ";
    
    if ( error ) {
        sys.print( format( "red", "[Error] ") + descr + obj.message );
        if ( error && error.stack && options.stack ) {
            sys.print( "\n" + error.stack + "\n" );
        }
    } else if ( !options.errorsOnly ) {
        sys.print( format( "green", "[OK]" ) + descr + obj.message );
    }
    
    sys.print( "\n" );
}