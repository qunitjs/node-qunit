var fs = require('fs'),
    path = require('path'),
    coverage = require('./coverage'),
    cp = require('child_process'),
    _ = require('underscore'),
    log = require('./log');

var options;

options = exports.options = {
    assertions: true,
    tests: true,
    summary: true,
    globalSummary: true,
    coverage: false,
    deps: null,
    namespace: null
};

/**
 * Run one spawned instance with tests
 * @param {Object} opts
 * @param {Function} callback
 */
function runOne(opts, callback) {
    var child;

    child = cp.fork(
        __dirname + '/child.js',
        [JSON.stringify(opts)],
        {env: process.env}
    );

    child.on('message', function(msg) {
        if (msg.event === 'assertionDone') {
            log.assertion(msg.data);
        } else if (msg.event === 'testDone') {
            log.test(msg.data);
        } else if (msg.event === 'done') {
            msg.data.code = opts.code.path;
            log.summary(msg.data);

            callback(msg.data);

            child.kill();
        }
    });
}

/**
 * Make an absolute path from relative
 * @param {string|Object} file
 * @return {Object}
 */
function absPath(file) {
    if (typeof file === 'string') {
        file = {path: file};
    }

    if (file.path.charAt(0) === '.') {
        file.path = path.join(process.cwd(), file.path);
    }

    return file;
}

/**
 * Convert path or array of paths to array of abs paths
 * @param {Array|string} files
 * @return {Array}
 */
function absPaths(files) {
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
    var filesCount = 0;

    if (!Array.isArray(files)) {
        files = [files];
    }

    files.forEach(function(file) {
        var opts =  _.extend({}, options, file);

        opts.deps = absPaths(opts.deps);
        opts.code = absPath(opts.code);
        opts.tests = absPaths(opts.tests);

        function finished(stat) {
            filesCount++;

            if (filesCount >= files.length) {
                if (options.assertions) {
                    log.print('assertions');
                }

                if (options.tests) {
                    log.print('tests');
                }

                if (options.summary) {
                    log.print('summary');
                }

                if (options.globalSummary) {
                    log.print('globalSummary');
                }

                if (typeof callback === 'function') {
                    callback(log.stats());
                }
            }
        }

        if (opts.coverage) {
            converage.instrument(opts.code);
        } else {
            runOne(opts, finished);
        }
    });
};

exports.log = log;
