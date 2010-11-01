/*
    jscoverage.jsm - Firefox module
    Copyright (C) 2008, 2009, 2010 siliconforks.com

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

var EXPORTED_SYMBOLS = ['_$jscoverage'];

var _$jscoverage = {};

function jscoverage_pad(s) {
  return '0000'.substr(s.length) + s;
}

function jscoverage_quote(s) {
  return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
    switch (c) {
    case '\b':
      return '\\b';
    case '\f':
      return '\\f';
    case '\n':
      return '\\n';
    case '\r':
      return '\\r';
    case '\t':
      return '\\t';
    case '\v':
      return '\\v';
    case '"':
      return '\\"';
    case '\\':
      return '\\\\';
    default:
      return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
    }
  }) + '"';
}

var JSCoverageUtils = {
  QueryInterface: function (aIID) {
    const Cc = Components.classes;
    const Ci = Components.interfaces;

    if (! aIID.equals(Ci.nsIObserver) && ! aIID.equals(Ci.nsISupports)) {
      throw Components.results.NS_ERROR_NO_INTERFACE;
    }
    return this;
  },

  getReportDirectory: function() {
    const Cc = Components.classes;
    const Ci = Components.interfaces;

    var directoryService = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties);
    /*
    CurProcD - directory in which the firefox process was started
    CurWorkD - current working directory
    Home - home directory
    TmpD - temp directory
    See xpcom/io/nsDirectoryServiceDefs.h
    */
    var reportDirectory = directoryService.get('CurProcD', Ci.nsILocalFile);
    reportDirectory.appendRelativePath('jscoverage-report');
    return reportDirectory;
  },

  readExistingCoverage: function() {
    try {
      const Cc = Components.classes;
      const Ci = Components.interfaces;

      var reportDirectory = this.getReportDirectory();
      if (! reportDirectory.exists()) {
        return;
      }
      var jsonFile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
      jsonFile.initWithFile(reportDirectory);
      jsonFile.appendRelativePath('jscoverage.json');
      if (! jsonFile.exists()) {
        return;
      }
      var fileInputStream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
      var json = null;
      try {
        fileInputStream.init(jsonFile, 1, 0, 0);
        var scriptableInputStream = Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
        scriptableInputStream.init(fileInputStream);
        try {
          json = scriptableInputStream.read(-1);
        }
        finally {
          scriptableInputStream.close();
        }
      }
      finally {
        fileInputStream.close();
      }
      var coverage = eval('(' + json + ')');
      for (var file in coverage) {
        _$jscoverage[file] = coverage[file].coverage;
        _$jscoverage[file].source = coverage[file].source;
      }
    }
    catch (e) {
      dump('jscoverage.jsm: error reading existing coverage report\n');
      dump(e);
      dump('\n');
    }
  },

  observe: function (aSubject, aTopic, aData) {
    try {
      dump('jscoverage.jsm: storing coverage data ...\n');

      const Cc = Components.classes;
      const Ci = Components.interfaces;

      var reportDirectory = this.getReportDirectory();
      if (! reportDirectory.exists()) {
        reportDirectory.create(Ci.nsIFile.DIRECTORY_TYPE, 0755);
      }

      var ioService = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
      var copyChrome = function(filename) {
        var channel = ioService.newChannel('chrome://jscoverage/content/' + filename, null, null);
        var binaryInputStream = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
        try {
          binaryInputStream.setInputStream(channel.open());

          var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
          file.initWithFile(reportDirectory);
          file.appendRelativePath(filename);
          var fileOutputStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
          fileOutputStream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
          var binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1'].createInstance(Ci.nsIBinaryOutputStream);
          try {
            binaryOutputStream.setOutputStream(fileOutputStream);

            for (;;) {
              var available = binaryInputStream.available();
              if (available === 0) {
                break;
              }
              var bytes = binaryInputStream.readBytes(available);
              binaryOutputStream.writeBytes(bytes, bytes.length);
            }

            if (filename === 'jscoverage.js') {
              var s = 'jscoverage_isReport = true;\n';
              binaryOutputStream.write(s, s.length);
            }
          }
          finally {
            binaryOutputStream.close();
          }
        }
        finally {
          binaryInputStream.close();
        }
      };
      copyChrome('jscoverage.html');
      copyChrome('jscoverage.js');
      copyChrome('jscoverage.css');
      copyChrome('jscoverage-throbber.gif');
      copyChrome('jscoverage-highlight.css');

      // write the coverage data
      var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
      file.initWithFile(reportDirectory);
      file.appendRelativePath('jscoverage.json');
      var fileOutputStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
      try {
        fileOutputStream.init(file, 0x02 | 0x08 | 0x20, 0644, 0);
        function write(s) {
          fileOutputStream.write(s, s.length);
        }
        write('{');
        var first = true;
        for (var file in _$jscoverage) {
          dump('jscoverage.jsm: storing coverage data for file ' + file + ' ...\n');
          if (first) {
            first = false;
          }
          else {
            write(',');
          }
          write(jscoverage_quote(file));
          write(':{"coverage":[');
          var coverage = _$jscoverage[file];
          var length = coverage.length;
          for (var line = 0; line < length; line++) {
            if (line > 0) {
              write(',');
            }
            var value = coverage[line];
            if (value === undefined || value === null) {
              value = 'null';
            }
            write(value.toString());
          }
          write('],"source":[');
          var source = coverage.source;
          length = source.length;
          for (line = 0; line < length; line++) {
            if (line > 0) {
              write(',');
            }
            write(jscoverage_quote(source[line]));
          }
          write(']}');
        }
        write('}');
        dump('jscoverage.jsm: coverage data stored\n');
      }
      finally {
        fileOutputStream.close();
      }
    }
    catch (e) {
      dump('jscoverage.jsm: error saving coverage report\n');
      dump(e);
      dump('\n');
    }
  }
};

try {
  JSCoverageUtils.readExistingCoverage();

  const Cc = Components.classes;
  const Ci = Components.interfaces;
  const jscoverage_observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
  // 'xpcom-shutdown' works under xpcshell
  // jscoverage_observerService.addObserver(JSCoverageUtils, 'quit-application', false);
  jscoverage_observerService.addObserver(JSCoverageUtils, 'xpcom-shutdown', false);

  dump('jscoverage.jsm: initialized\n');
}
catch (e) {
  dump('jscoverage.jsm: initialization error\n');
  dump(e);
  dump('\n');
}
