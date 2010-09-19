var fs = require( "fs" ),
    sys = require( "sys" ),
    spawn = require( "child_process" ).spawn;

var options = exports.options = {
        errorsOnly: false,
        errorStack: true,
        report: true
    };

/**
 * Run tests in spawned node instance async for every test.
 * @param {Object|Array} files
 * @param {Function} callback optional
 */
exports.run = function( files, callback ) {
    
    if ( !(files instanceof Array) ) {
        files = [files];
    }

    var report = {
            files: 0,
            tests: 0,
            errors: 0,
            success: 0
        };

    files.forEach( function( file ) {
        var proc = spawn( process.execPath, [ __dirname + "/cli.js", file.code, file.test ] );
        
        proc.stderr.on( "data", function( data ) {
            sys.print( data );
        });    
        
        proc.stdout.on( "data", function( data ) {
            report.tests++;
            data.toString().split( "\n" ).forEach(function( data ) {
                if ( data.length <=0 ) {
                    return;
                }

                data = JSON.parse( data );

                if ( data.errorStack ) {
                    report.errors++;
                }

                log( data );
            });
        });  
        
        proc.on( "exit", function( code ) {
            report.files++;
            
            if ( report.files === files.length && options.report ) {
                report.success = report.tests - report.errors;
                sys.print(
                    "\nFiles: " + report.files +
                    "\nTests: " + report.tests +
                    "\nSuccesses: " + report.success +
                    "\n" + format( "red", "Errors: " + report.errors )  + "\n\n"
                );
            }

            if ( typeof callback === "function" ) {
                callback( report );                
            }
        });        
    });
};

/**
 * Format or colorize a message for console
 * @param {String} f
 * @param {String} str
 */
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

/**
 * Print out test report object
 * @param {Object} obj
 */
function log( obj ) {
    var descr = "[" + (obj.module ? obj.module +": " : "") + obj.name +"] ";
    
    obj.message = obj.message || "";
    
    if ( obj.errorStack ) {
        sys.print( format( "red", "[Error]" + descr + obj.message ) );
        if ( options.errorStack ) {
            sys.print( "\n" + format( "red", obj.errorStack )+ "\n" );
        }
    } else if ( !options.errorsOnly ) {
        sys.print( format( "green", "[OK]" ) + descr + obj.message + "\n" );
    }
    
}
