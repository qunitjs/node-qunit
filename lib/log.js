var util = require('util'),
    Table = require('cli-table');

var logs = defaultLogs();

exports.assertion = (function() {
    var table, 
        currentModule, module,
        currentTest, test;
    
    table = logs.assertions.table = new Table({
    	head: ['Module', 'Test', 'Assertion', 'Result'],
        colWidths: [40, 40, 40, 8]
    });
    
    return function(data) {
        // just easier to read the table
        if (data.module === currentModule) {
            module = '';
        } else {
            module = currentModule = data.module;
        }
        
        // just easier to read the table
        if (data.test === currentTest) {
            test = '';
        } else {
            test = currentTest = data.test;
        }        

        table.push([module, test, data.message, data.result ? 'ok' : 'fail']);

        logs.assertions.data.push(data);
    };
}());

exports.test = (function() {
    var table, 
        currentModule, module;
    
    table = logs.tests.table = new Table({
    	head: ['Module', 'Test', 'Failed', 'Passed', 'Total'],
        colWidths: [40, 40, 8, 8, 8]
    });
    
    return function(data) {
        // just easier to read the table
        if (data.module === currentModule) {
            module = '';
        } else {
            module = currentModule = data.module;
        }

        table.push([module, data.name, data.failed, data.passed, data.total]);

        logs.tests.data.push(data);
    };
}());

exports.summary = (function() {
    var table, fileColWidth = 50;
    
    table = logs.summary.table = new Table({
    	head: ['File', 'Failed', 'Passed', 'Total', 'Runtime'],
        colWidths: [fileColWidth + 2, 10, 10, 10, 10]
    });
    
    return function(data) {
        logs.summary.data.push(data);

        // truncate file name 
        if (data.code.length > fileColWidth) {
            data.code = '...' + data.code.slice(data.code.length - fileColWidth + 3);
        }

        table.push([data.code, data.failed, data.passed, data.total, data.runtime]);
    };
}());

exports.stats = function() {
    var stats = {
            files: 0,
            tests: 0,
            assertions: 0,
            failed: 0,
            passed: 0
        };
    
    logs.summary.data.forEach(function(file) {
        stats.files++;
        stats.assertions += file.total;
        stats.failed += file.failed;
        stats.passed += file.passed;
    });
    
    stats.tests = logs.tests.data.length;
    
    return stats;    
};

function defaultLogs() {
    return {
        assertions: {
            data: [],
            table: null
        },
        tests: {
            data: [],
            table: null
        },
        summary: {
            data: [],
            table: null
        }
    };    
}

exports.reset = function() {
    logs = defaultLogs();        
};

exports.print = function(name) {
    if (logs[name].data.length) {
        var upperName = name.charAt(0).toUpperCase() + name.substr(1);
        
        util.print('\n' + upperName + '\n' + logs[name].table.toString() + '\n');
    }
};
