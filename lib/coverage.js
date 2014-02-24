var path = require('path'),
    util = require('util'),
    _ = require('underscore');

var istanbul, collector;

try { istanbul = require('istanbul'); }
catch (e) {}

exports.setup = function() {
    collector = new istanbul.Collector();
};

exports.append = function(coverage) {
    collector && coverage && collector.add(coverage);
};

exports.report = function() {
    if (collector) {
        var opts = { dir: path.resolve('coverage') },
            Report = istanbul.Report,
            reports = [ Report.create('lcov', opts), Report.create('json', opts), Report.create('text-summary', opts) ];
        reports.forEach(function (rep) {
            rep.writeReport(collector, true);
        });
    }
};

function resolvePaths(files) {
    if (Array.isArray(files)) return files.map(function (file) {
        return file.path;
    });
    return [files.path];
}

exports.cover = function(options, run) {
    istanbul.matcherFor({
        includes: resolvePaths(options.code),
        excludes: resolvePaths(options.tests)
    }, function (err, matcher) {
        if (err) { throw err; }
        var instrumenter = new istanbul.Instrumenter();
        istanbul.hook.hookRequire(matcher, instrumenter.instrumentSync.bind(instrumenter));
        run();
    });
};

if (!istanbul) {
    _.each(exports, function(fn, name) {
        exports[name] = function() {
            util.error('Module "istanbul" is not installed.'.red);
            process.exit(1);
        };
    });
}
