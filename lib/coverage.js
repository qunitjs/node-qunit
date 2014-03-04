var path = require('path'),
    util = require('util'),
    _ = require('underscore');

var istanbul, collector;

try {
    istanbul = require('istanbul');
} catch (e) {}

exports.setup = function() {
    collector = new istanbul.Collector();
};

exports.add = function(coverage) {
    if (collector && coverage) collector.add(coverage);
};

exports.get = function() {
    var summaries;
    if (collector) {
        summaries = [];
        collector.files().forEach(function(file) {
            summaries.push(istanbul.utils.summarizeFileCoverage(collector.fileCoverageFor(file)));
        });
        return istanbul.utils.mergeSummaryObjects.apply(null, summaries);
    }
};

exports.report = function() {
    var opts, Report, reports;

    if (collector) {
        opts = {dir: path.resolve('coverage')};
        Report = istanbul.Report;
        reports = [Report.create('lcov', opts), Report.create('json', opts)];
        reports.forEach(function(rep) {
            rep.writeReport(collector, true);
        });
    }
};

function resolvePaths(files) {
    if (Array.isArray(files)) {
        return files.map(function (file) {
            return file.path;
        });
    }
    return [files.path];
}

exports.instrument = function(options, callback) {
    istanbul.matcherFor({
        includes: resolvePaths(options.code),
        excludes: resolvePaths(options.tests)
    }, function (err, matcher) {
	var instrumenter;

        if (err) {
	    return callback(err);
        }

        instrumenter = new istanbul.Instrumenter();
        istanbul.hook.hookRequire(matcher, instrumenter.instrumentSync.bind(instrumenter));
        callback();
    });
};

if (!istanbul) {
    _.each(exports, function(fn, name) {
        exports[name] = function() {
            util.error('\nModule "istanbul" is not installed.'.red);
            process.exit(1);
        };
    });
}
