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
            log.summary(msg.data);

            child.kill();
            
            if (typeof callback === 'function') {
                callback();
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

    var report = {
            files: 0,
            tests: 0,
            assertions: 0,
            errors: 0,
            success: 0,
            time: Date.now()
        };

    files.forEach(function(opts) {

        opts =  {
            deps: toArray(opts.deps || options.deps),
            code: absPath(opts.code),
            tests: toArray(opts.tests),
            paths: opts.paths || options.paths,
            coverage: opts.coverage || options.coverage
        };

        function finished(cov) {
            if (report.files < files.length) {
                return;
            }

            if (options.assertions) {
                log.print('assertions');
            }
    
            if (options.tests) {
                log.print('tests');
            }

            if (options.summary) {
                log.print('summary');
            }

            if (typeof callback === 'function') {
                callback(report);
            }
        }

        if (opts.coverage) {

        } else {
            runOne(opts, report, finished);
        }
    });
};