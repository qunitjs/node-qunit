if (! _$jscoverage['javascript-debugger.js']) {
  _$jscoverage['javascript-debugger.js'] = [];
  _$jscoverage['javascript-debugger.js'][1] = 0;
  _$jscoverage['javascript-debugger.js'][2] = 0;
  _$jscoverage['javascript-debugger.js'][5] = 0;
}
_$jscoverage['javascript-debugger.js'].source = ["<span class=\"k\">try</span> <span class=\"k\">{</span>","  f<span class=\"k\">();</span>","<span class=\"k\">}</span>","<span class=\"k\">catch</span> <span class=\"k\">(</span>e<span class=\"k\">)</span> <span class=\"k\">{</span>","  <span class=\"k\">debugger</span><span class=\"k\">;</span>","<span class=\"k\">}</span>"];
_$jscoverage['javascript-debugger.js'][1]++;
try {
  _$jscoverage['javascript-debugger.js'][2]++;
  f();
}
catch (e) {
  _$jscoverage['javascript-debugger.js'][5]++;
  debugger;
}
