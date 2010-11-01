if (! _$jscoverage['javascript-throw.js']) {
  _$jscoverage['javascript-throw.js'] = [];
  _$jscoverage['javascript-throw.js'][1] = 0;
  _$jscoverage['javascript-throw.js'][2] = 0;
  _$jscoverage['javascript-throw.js'][5] = 0;
}
_$jscoverage['javascript-throw.js'].source = ["<span class=\"k\">try</span> <span class=\"k\">{</span>","  <span class=\"k\">throw</span> <span class=\"s\">\"x\"</span><span class=\"k\">;</span>","<span class=\"k\">}</span>","<span class=\"k\">catch</span> <span class=\"k\">(</span>e<span class=\"k\">)</span> <span class=\"k\">{</span>","  <span class=\"k\">;</span>","<span class=\"k\">}</span>"];
_$jscoverage['javascript-throw.js'][1]++;
try {
  _$jscoverage['javascript-throw.js'][2]++;
  throw "x";
}
catch (e) {
  _$jscoverage['javascript-throw.js'][5]++;
  ;
}
