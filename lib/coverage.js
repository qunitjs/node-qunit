/**
 * Some functions are borrowed by Expresso http://github.com/visionmedia/expresso
 */

var util = require( "util" ),
    path = require( "path" ),
    fs = require( "fs" ),
    spawn = require( "child_process" ).spawn;

var boring = false;

var jscoveragePath = path.normalize( __dirname + "/../deps/jscoverage/jscoverage" );

/**
* Pad the given string to the maximum width provided.
*
* @param {String} str
* @param {Number} width
* @return {String}
*/
function lpad(str, width) {
    str = String(str);
    var n = width - str.length;
    if (n < 1) return str;
    while (n--) str = ' ' + str;
    return str;
}

/**
* Pad the given string to the maximum width provided.
*
* @param {String} str
* @param {Number} width
* @return {String}
*/
function rpad(str, width) {
    str = String(str);
    var n = width - str.length;
    if (n < 1) return str;
    while (n--) str = str + ' ';
    return str;
}


/**
* Colorized util.error().
*
* @param {String} str
*/

function print(str){
    util.error(colorize(str));
}

/**
* Colorize the given string using ansi-escape sequences.
* Disabled when --boring is set.
*
* @param {String} str
* @return {String}
*/
function colorize(str){
    var colors = { bold: 1, red: 31, green: 32, yellow: 33 };
    return str.replace(/\[(\w+)\]\{([^]*?)\}/g, function(_, color, str){
        return boring
            ? str
            : '\x1B[' + colors[color] + 'm' + str + '\x1B[0m';
    });
}

/**
* Populate code coverage data.
*
* @param {Object} cov
*/
function populateCoverage(cov) {
    cov.LOC =
    cov.SLOC =
    cov.totalFiles =
    cov.totalHits =
    cov.totalMisses =
    cov.coverage = 0;
    for (var name in cov) {
        var file = cov[name];
        if (Array.isArray(file)) {
            // Stats
            ++cov.totalFiles;
            cov.totalHits += file.totalHits = coverage(file, true);
            cov.totalMisses += file.totalMisses = coverage(file, false);
            file.totalLines = file.totalHits + file.totalMisses;
            cov.SLOC += file.SLOC = file.totalLines;
            if (!file.source) file.source = [];
            cov.LOC += file.LOC = file.source.length;
            file.coverage = (file.totalHits / file.totalLines) * 100;
            // Source
            var width = file.source.length.toString().length;
            file.source = file.source.map(function(line, i){
                ++i;
                var hits = file[i] === 0 ? 0 : (file[i] || ' ');
                if (!boring) {
                    if (hits === 0) {
                        hits = '\x1b[31m' + hits + '\x1b[0m';
                        line = '\x1b[41m' + line + '\x1b[0m';
                    } else {
                        hits = '\x1b[32m' + hits + '\x1b[0m';
                    }
                }
                return '\n ' + lpad(i, width) + ' | ' + hits + ' | ' + line;
            }).join('');
        }
    }
    cov.coverage = (cov.totalHits / cov.SLOC) * 100;
}

/**
* Total coverage for the given file data.
*
* @param {Array} data
* @return {Type}
*/
function coverage(data, val) {
    var n = 0;
    for (var i = 0, len = data.length; i < len; ++i) {
        if (data[i] !== undefined && data[i] == val) ++n;
    }
    return n;
}

/**
 * Create a temp dir
 * 
 * @param {Function} callback
 */
function mktemp( callback ) {
    var child,
        dir = "";
    
    child = spawn( "mktemp", [ "-dt", "jscoverage.XXXXXXXXXX"] );

    child.stderr.on( "data", function( err ) {
        if ( err.toString().trim() ) {
            throw new Error( err );
        }
    });
    
    child.stdout.on( "data", function( path ) {
        dir += path.toString().trim();
    });
    
    child.on( "exit", function( code ) {
        callback( dir );
    });
}

/**
* Report test coverage.
*
* @param {Object} cov
*/
exports.reportCoverage = function(cov) {
    populateCoverage(cov);
    // Stats
    print('\n [bold]{Test Coverage}\n');
    var sep = ' +------------------------------------------+----------+------+------+--------+';
    util.puts(sep);
    util.puts(' | filename ' + lpad('', 31) + ' | coverage | LOC | SLOC | missed  |');
    util.puts(sep);
    for (var name in cov) {
        var file = cov[name];
        if (Array.isArray(file)) {
            util.print(' | ' + rpad(name, 40));
            util.print(' | ' + lpad(file.coverage.toFixed(2), 8));
            util.print(' | ' + lpad(file.LOC, 4));
            util.print(' | ' + lpad(file.SLOC, 4));
            util.print(' | ' + lpad(file.totalMisses, 6));
            util.print(' |\n');
        }
    }
    util.puts(sep);
    util.print(' |' + rpad('', 41));
    util.print(' | ' + lpad(cov.coverage.toFixed(2), 8));
    util.print(' | ' + lpad(cov.LOC, 4));
    util.print(' | ' + lpad(cov.SLOC, 4));
    util.print(' | ' + lpad(cov.totalMisses, 6));
    util.print(' |\n');
    util.puts(sep);
    // Source
    for (var name in cov) {
        if (name.match(/\.js$/)) {
            var file = cov[name];
            print('\n [bold]{' + name + '}:');
            print(file.source);
            util.print('\n');
        }
    }
};

/**
 * Add instruments to code using jscoverage. 
 * jscoverage is inflexible if I want to work with files, not dirs,
 * so I symlink a needed file together with dir structure to get the right path in report
 * 
 * @param {String} origin path to the file
 * @param {Function} callback
 */
exports.instrument = function( origin, callback ) {
    
    mktemp( function( tmp ) {
        var // relative path to the file
            pathRel = origin.substr( process.cwd().length ),
            // path to the symlinked file
            src = path.join( tmp, "code", pathRel ),
            // path to the instrumented file
            cov = path.join( tmp, "cov", pathRel );

        // using spawned mkdir to create the dir recursively
        spawn( "mkdir", ["-p", path.dirname(src) ]).on( "exit", function() {
            // now symlink the file which have to be instrumented
            fs.symlinkSync( origin, src );

            var child = spawn( jscoveragePath, ["-v", path.join( tmp, "code"), path.join( tmp, "cov")] );

            child.on( "exit", function() {
                callback( cov, function() {
                    // remove tmp dir
                    spawn( "rm", ["-fr", tmp] );    
                });
            });
            
            child.stderr.on( "data", function( buf ) {
                throw new Error( buf );
            });

        });        
    });
};