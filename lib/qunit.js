var sys = require( "sys" ),
    assert = require( "assert" );

var undefined,
    pause = false,
    queue = [],
    test,
    module = {};

exports.begin = function() {
    if ( queue.length <= 0 ) {
        throw new Error( "There are no tests defined" );
    }

    api.start();    
};

/**
 * Ecma 5 doesn't defines this method, so just hope they also like jQuery's way :)
 * You can pass so much objects as you like, all properties will be copied to the first object
 * 
 * @param {Object|Boolean} deep
 * @param {Object}
 * @return {Object}
 */
exports.extend = function( deep /*, obj, obj, ...*/ ) {
    // take first argument, if its not a boolean
    var args = arguments,
        i = typeof deep === 'boolean' ? 1 : 0,
        target = args[i];
    
    for ( ; i < args.length; ++i ) {
        typeof args[i] === "object" && Object.keys( args[i] ).forEach(function( key ) {
            // if deep extending and both of keys are objects
            if ( deep === true && target[key] ) {
                args.callee(deep, target[key], args[i][key]);    
            } else {
                target[key] = args[i][key];
            }
        });        
    }  
          
    return target;
};

var api = exports.api = {};

// for the case api properties will be overwritten by tested module
api.QUnit = api;


api.module = function( name, env ) {
    
    env = env || {};
    
    module = {
        name: name,
        env: env
    };
    
    return this;
};

api.test = function( name, expect, fn, async ) {

    if ( typeof name !== "string" ) {
        throw new Error( "Test name should be the first parameter" );
    }
    
    var type = typeof expect,
        env;
    if ( type === "function" ) {
        fn = expect;
        expect = undefined;
    // expect can extend module env    
    } else if ( type === "object" ) {
        env = expect;
        expect = undefined;
    }
    
    if ( typeof fn !== "function" ) {
        throw new Error( "No test function passed" );
    }
    
    queue.push({
        name: name,
        module: module,
        fn: fn,
        expected: expect,
        env: env,
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
    var r = {
            message: message
        };
    
    try {
        assert.ok( value );
    } catch (err) {
        r.errorStack = err.stack;
    }
    
    log(r); 
    
    return this;
};    
    
api.equals = api.equal = function( actual, expected, message ) {
    test.done++;
    
    var r = {
            message: message
        }; 
           
    try {
        assert.equal( actual, expected );
    } catch( err ) {
        r.errorStack = err.stack;
    }
    
    log( r );   

    return this;
};

    
api.strictEqual = function( actual, expected, message ) {
    test.done++;
    
    var r = {
            message: message
        }; 
           
    try {
        assert.strictEqual( actual, expected );
    } catch( err ) {
        r.errorStack = err.stack;
    }
    
    log( r );   

    return this;
};

api.same = api.deepEqual = function( actual, expected, message ) {
    test.done++;
    
    var r = {
            message: message
        }; 
            
    try {
        assert.deepEqual( actual, expected );
    } catch( err ) {
        r.errorStack = err.stack;
    }
    
    log(  r );  

    return this;
};

/**
 * typeof replacement that works always well.Borrowed from jQuery.
 * @param {String|Number|Object|Array|Date|RegExp} obj
 * @return {String}
 */
api.typeOf = (function() {
    var toString = Object.prototype.toString;
    return function( obj ) {
        return !obj ? String( obj ) : toString.call( obj ).slice( 8, -1 ).toLowerCase();
    };    
}()); 

/**
 * Original from QUnit
 */
api.equiv = function () {

    var innerEquiv; // the real equiv function
    var callers = []; // stack to decide between skip/abort functions
    var parents = []; // stack to avoiding loops from circular referencing

    // Call the o related callback with the given arguments.
    function bindCallbacks(o, callbacks, args) {
        var prop = api.typeOf(o);
        if (prop) {
            if (api.typeOf(callbacks[prop]) === "function") {
                return callbacks[prop].apply(callbacks, args);
            } else {
                return callbacks[prop]; // or undefined
            }
        }
    }
    
    var callbacks = function () {

        // for string, boolean, number and null
        function useStrictEquality(b, a) {
            if (b instanceof a.constructor || a instanceof b.constructor) {
                // to catch short annotaion VS 'new' annotation of a declaration
                // e.g. var i = 1;
                // var j = new Number(1);
                return a == b;
            } else {
                return a === b;
            }
        }

        return {
            "string": useStrictEquality,
            "boolean": useStrictEquality,
            "number": useStrictEquality,
            "null": useStrictEquality,
            "undefined": useStrictEquality,

            "nan": function (b) {
                return isNaN(b);
            },

            "date": function (b, a) {
                return api.typeOf(b) === "date" && a.valueOf() === b.valueOf();
            },

            "regexp": function (b, a) {
                return api.typeOf(b) === "regexp" &&
                    a.source === b.source && // the regex itself
                    a.global === b.global && // and its modifers (gmi) ...
                    a.ignoreCase === b.ignoreCase &&
                    a.multiline === b.multiline;
            },

            // - skip when the property is a method of an instance (OOP)
            // - abort otherwise,
            // initial === would have catch identical references anyway
            "function": function () {
                var caller = callers[callers.length - 1];
                return caller !== Object &&
                        typeof caller !== "undefined";
            },

            "array": function (b, a) {
                var i, j, loop;
                var len;

                // b could be an object literal here
                if ( ! (api.typeOf(b) === "array")) {
                    return false;
                }
                
                len = a.length;
                if (len !== b.length) { // safe and faster
                    return false;
                }
                
                //track reference to avoid circular references
                parents.push(a);
                for (i = 0; i < len; i++) {
                    loop = false;
                    for(j=0;j<parents.length;j++){
                        if(parents[j] === a[i]){
                            loop = true;//dont rewalk array
                        }
                    }
                    if (!loop && ! innerEquiv(a[i], b[i])) {
                        parents.pop();
                        return false;
                    }
                }
                parents.pop();
                return true;
            },

            "object": function (b, a) {
                var i, j, loop;
                var eq = true; // unless we can proove it
                var aProperties = [], bProperties = []; // collection of strings

                // comparing constructors is more strict than using instanceof
                if ( a.constructor !== b.constructor) {
                    return false;
                }

                // stack constructor before traversing properties
                callers.push(a.constructor);
                //track reference to avoid circular references
                parents.push(a);
                
                for (i in a) { // be strict: don't ensures hasOwnProperty and go deep
                    loop = false;
                    for(j=0;j<parents.length;j++){
                        if(parents[j] === a[i])
                            loop = true; //don't go down the same path twice
                    }
                    aProperties.push(i); // collect a's properties

                    if (!loop && ! innerEquiv(a[i], b[i])) {
                        eq = false;
                        break;
                    }
                }

                callers.pop(); // unstack, we are done
                parents.pop();

                for (i in b) {
                    bProperties.push(i); // collect b's properties
                }

                // Ensures identical properties name
                return eq && innerEquiv(aProperties.sort(), bProperties.sort());
            }
        };
    }();

    innerEquiv = function () { // can take multiple arguments
        var args = Array.prototype.slice.apply(arguments);
        if (args.length < 2) {
            return true; // end transition
        }

        return (function (a, b) {
            if (a === b) {
                return true; // catch the most you can
            } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || api.typeOf(a) !== api.typeOf(b)) {
                return false; // don't lose time with error prone cases
            } else {
                return bindCallbacks(a, callbacks, [b, a]);
            }

        // apply transition with (1..n) arguments
        })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length -1));
    };

    return innerEquiv;

}();  


function run() {
    // all tests are done
    if ( queue.length <= 0 ) {
        return;
    }

    test = queue[0];
    module = test.module;

    if ( module.env && module.env.setup && !test.setupDone ) {
        module.env.setup();
        test.setupDone = true;
    }
            
    // run the test
    if ( !pause ) {
        test.fn.call( api.QUnit.current_testEnvironment = exports.extend( true, test.env || {}, module.env ) );
    }
    
    if ( test.async ) {
        api.stop();
    } else if ( !pause ) {
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
  
    if ( module.env && module.env.teardown && !test.teardownDone ) {
        module.env.teardown();
        test.teardownDone = true;
    } 
    
    if ( pause ) {
        return;
    }

    // check if expected assertions count is correct
    if ( test.expected !== undefined && test.expected !== test.done ) {
        var errorStack;
        // trigger an error to get an error stack
        try {
            throw new Error( "Assertions amount" );
        } catch( err ) {
            errorStack = err.stack;    
        }
        
        log({
            message: "Expected " + test.expected + " assertions, but " + test.done + " were run",
            errorStack: errorStack  
        });
    }  
    
    queue.shift();  
}

function log( obj ) {
    
    obj.message = obj.message || "";
    obj.name = test.name;
    obj.module = module.name;

    sys.print( JSON.stringify(obj) + "\n" );
}