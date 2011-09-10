var fs = require('fs'),
    path = require('path'),
    coverage = require('./coverage'),
    cp = require('child_process'),
    log = require('./log');

var options = exports.options = {
        assertions: false,
        tests: false,
        summary: true,
        coverage: true,
        paths: null,
        deps: null
    };

/**
 * Run one spawned instance with tests
 * @param {Object} opts
 * @param {Object} report
 * @param {Function} callback
 */
function runOne(opts, callback) {
    var child;

	child = cp.fork(
	    __dirname + '/child.js', 
	    [JSON.stringify(opts)], 
	    {customFds: [0, -1, -1]}
	);

    // forward stderr and stdout streams from the child    
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('message', function(msg) {
        if (msg.event === 'assertionDone') {
            log.assertion(msg.data);    
        } else if (msg.event === 'testDone') {
            log.test(msg.data);            
        } else if (msg.event === 'done') {
            msg.data.code = opts.code.path;
            log.summary(msg.data);

            child.kill();
            
            if (typeof callback === 'function') {
                callback(msg.data);
            }            
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
        file.path = path.join(process.cwd(), file.path);
    }

    return file;
}

/**
 * Convert path or array of paths to array of abs paths
 * @param {Array|String} files
 * @return {Array}
 */
function toArray(files) {
    var ret = [];

    if (Array.isArray(files)) {
        files.forEach(function(file) {
            ret.push(absPath(file));
        });
    } else if (files) {
        ret.push(absPath(files));
    }

    return ret;
}

/**
 * Run tests in spawned node instance async for every test.
 * @param {Object|Array} files
 * @param {Function} callback optional
 */
exports.run = function(files, callback) {
    if (!Array.isArray(files)) {
        files = [files];
    }

    var filesCount = 0;

    files.forEach(function(file) {
        var opts =  {
                deps: toArray(file.deps || options.deps),
                code: absPath(file.code),
                tests: toArray(file.tests),
                paths: file.paths || options.paths,
                coverage: file.coverage
            };
            
        if (typeof opts.coverage === 'undefined') {
            opts.coverage = options.coverage;
        }    

        function finished(stat) {
            if (options.assertions) {
                log.print('assertions');
            }
    
            if (options.tests) {
                log.print('tests');
            }

            filesCount++;
            
            if (filesCount >= files.length) {
                if (options.summary) {
                    log.print('summary');
                }
    
                if (typeof callback === 'function') {
                    callback(log.stats());
                }
            }

        }

        if (opts.coverage) {
        } else {
            runOne(opts, finished);
        }
    });
};