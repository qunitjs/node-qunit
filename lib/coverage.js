var path = require('path'),
    _ = require('underscore');

var istanbul,
    collector,
    options = {
        dir: 'coverage'
    };

try {
    istanbul = require('istanbul');
} catch (e) {}

exports.setup = function(opts) {
    collector = new istanbul.Collector();

    _.extend(options, opts);
    options.dir = path.resolve(options.dir);
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
    var Report, reports;

    if (collector) {
        Report = istanbul.Report;
        reports = [Report.create('lcov', options), Report.create('json', options)];
        reports.forEach(function(rep) {
            rep.writeReport(collector, true);
        });
    }
};

exports.instrument = function(options) {
    var matcher, instrumenter;

    matcher = function (file) {
        return file === options.code.path;
    }
    instrumenter = new istanbul.Instrumenter();
    istanbul.hook.hookRequire(matcher, instrumenter.instrumentSync.bind(instrumenter));
};

if (!istanbul) {
    _.each(exports, function(fn, name) {
        exports[name] = function() {
            console.error('\nModule "istanbul" is not installed.'.red);
            process.exit(1);
        };
    });
}
