var path = require('path'),
    util = require('util'),
    _ = require('underscore');

var istanbul, collector;

try { istanbul = require('istanbul'); }
catch (e) {}

exports.setup = function() {
    collector = new istanbul.Collector();
};

exports.add = function(coverage) {
    collector && coverage && collector.add(coverage);
};

exports.get = function() {
    if (collector) {
        var summaries = [];
        collector.files().forEach(function (file) {
            summaries.push(istanbul.utils.summarizeFileCoverage(collector.fileCoverageFor(file)));
        });
        return istanbul.utils.mergeSummaryObjects.apply(null, summaries);
    }
};

exports.report = function() {
    if (collector) {
        var opts = { dir: path.resolve('coverage') },
            Report = istanbul.Report,
            reports = [ Report.create('lcov', opts), Report.create('json', opts) ];
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

exports.instrument = function(options, cb) {
    istanbul.matcherFor({
        includes: resolvePaths(options.code),
        excludes: resolvePaths(options.tests)
    }, function (err, matcher) {
        if (err) { throw err; }
        var instrumenter = new istanbul.Instrumenter();
        istanbul.hook.hookRequire(matcher, instrumenter.instrumentSync.bind(instrumenter));
        cb();
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
