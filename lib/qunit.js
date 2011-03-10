var fs = require( "fs" ),
    util = require( "util" ),
    path = require( "path" ),
    coverage = require( "./coverage" ),
    spawn = require( "child_process" ).spawn;

var options = exports.options = {
        errorsOnly: false,
        errorStack: true,
        summary: true,
        coverage: true,
        paths: null,
        deps: null
    };


/**
 * Format or colorize a message for console
 * @param {String} f
 * @param {String} str
 */
function format( str, f ) {
    switch ( f ) {
        case "red":
            return "\033[31m" + str + "\033[39m";
        case "green":
            return "\033[32m" + str + "\033[39m";
        case "bold":
            return "\033[1m" + str + "\033[22m";
    }
}

/**
 * Print out test report object
 * @param {Object} obj
 */
function logTest( obj ) {
    var descr = "[" + (obj.module ? obj.module + ": " : "") + obj.name + "] ";

    obj.message = obj.message || "";

    if ( obj.errorStack ) {
        util.print( format(  "[Error]" + descr + obj.message, "red" ) );
        if ( options.errorStack ) {
            util.print( "\n" + format( obj.errorStack, "red" ) + "\n" );
        }
    } else if ( !options.errorsOnly ) {
        util.print( format( "[OK]", "green" ) + descr + obj.message + "\n" );
    }

}

/**
 * Print out summery results for all tests
 * @param {Object} report
 * @param {Object} cov
 */
function printSummary( report, cov ) {
    util.print(
        "\nFiles: " + report.files +
        "\nTests: " + report.tests +
        "\nAssertions: " + report.assertions +
        "\nSuccesses: " + report.success +
        "\n" + format( "Errors: " + report.errors, "red" ) +
        "\n\nTime: " + report.time +  " ms\n\n"
    );

    if ( cov ) {
        coverage.reportCoverage( cov );
    }
}

/**
 * Run one spawned instance with tests
 * @param {Object} opts
 * @param {Object} report
 * @param {Function} callback
 */
function run( opts, report, callback ) {
    var child,
        testname,
        cov,
        results = [];

    child = spawn( process.execPath, [__dirname + "/bootstrap.js", JSON.stringify( opts )] );

    child.stdout.on( "data", function ( buf ) {
        results.push(buf.toString());
    });

    child.stderr.on( "data", function ( buf ) {
        util.print( "stderr: " + buf );
    });

    child.on( "exit", function() {
        JSON.parse( results.join( "" ) ).forEach(function( data ) {
            report.assertions++;

            // its coverage json
            if ( data.cov ) {
                cov = data.cov;
                return;
            }

            if ( data.name !== testname ) {
                report.tests++;
                testname = data.name;
            }

            if ( data.errorStack ) {
                report.errors++;
            }

            logTest( data );
        });

        report.files++;

        if ( typeof callback === "function" ) {
            callback( cov );
        }
    });
}

/**
 * Make an absolute path from relative
 * @param {String|Object} file
 * @return {Object}
 */
function absPath(file) {
    if (typeof file === 'string') {
        file = {path: file};
    }
    
    if(file.path.charAt(0) === '.') {
        file.path = path.join( process.cwd(), file.path );
    }

    return file;
}

/**
 * Convert path or array of paths to array of abs paths
 * @param {Array|String|Object} files
 * @return {Array}
 */
function toArray( files ) {
    var ret = [];

    if ( Array.isArray(files) ) {
        files.forEach( function( file ) {
            ret.push( absPath(file) );
        });
    } else if (files) {
        ret.push( absPath(files) );
    }

    return ret;
}

/**
 * Run tests in spawned node instance async for every test.
 * @param {Object|Array} files
 * @param {Function} callback optional
 */
exports.run = function( files, callback ) {
    if ( !Array.isArray(files) ) {
        files = [files];
    }

    var report = {
            files: 0,
            tests: 0,
            assertions: 0,
            errors: 0,
            success: 0,
            time: Date.now()
        };

    files.forEach( function( opts ) {

        opts =  {
            deps: toArray( opts.deps || options.deps ),
            code: absPath( opts.code ),
            tests: toArray( opts.tests ),
            paths: opts.paths || options.paths,
            coverage: opts.coverage || options.coverage
        };

        function finished( cov ) {
            if ( report.files < files.length ) {
                return;
            }

            if ( options.summary ) {
                report.success = report.assertions - report.errors;
                report.time = Date.now() - report.time;
                printSummary( report, cov );
            }

            if ( typeof callback === "function" ) {
                callback( report );
            }
        }

        if ( opts.coverage ) {
            coverage.instrument( opts.code.path, function( newCodePath, cleanup ) {
                opts.code.path = newCodePath;
                run( opts, report, function(cov) {
                    cleanup();
                    finished(cov);
                });
            });
        } else {
            run( opts, report, finished );
        }
    });
};