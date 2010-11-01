if (! _$jscoverage['javascript-unaryop.js']) {
  _$jscoverage['javascript-unaryop.js'] = [];
  _$jscoverage['javascript-unaryop.js'][1] = 0;
  _$jscoverage['javascript-unaryop.js'][2] = 0;
  _$jscoverage['javascript-unaryop.js'][3] = 0;
  _$jscoverage['javascript-unaryop.js'][4] = 0;
  _$jscoverage['javascript-unaryop.js'][5] = 0;
  _$jscoverage['javascript-unaryop.js'][6] = 0;
  _$jscoverage['javascript-unaryop.js'][7] = 0;
}
_$jscoverage['javascript-unaryop.js'].source = ["x <span class=\"k\">=</span> <span class=\"k\">-</span>x<span class=\"k\">;</span>","x <span class=\"k\">=</span> <span class=\"k\">+</span>x<span class=\"k\">;</span>","x <span class=\"k\">=</span> <span class=\"k\">!</span>x<span class=\"k\">;</span>","x <span class=\"k\">=</span> <span class=\"k\">~</span>x<span class=\"k\">;</span>","x <span class=\"k\">=</span> <span class=\"k\">typeof</span> x<span class=\"k\">;</span>","x <span class=\"k\">=</span> <span class=\"k\">typeof</span> <span class=\"s\">123</span><span class=\"k\">;</span>  <span class=\"c\">// this has a different pn_op value</span>","x <span class=\"k\">=</span> <span class=\"k\">void</span> x<span class=\"k\">;</span>"];
_$jscoverage['javascript-unaryop.js'][1]++;
x = (- x);
_$jscoverage['javascript-unaryop.js'][2]++;
x = (+ x);
_$jscoverage['javascript-unaryop.js'][3]++;
x = (! x);
_$jscoverage['javascript-unaryop.js'][4]++;
x = (~ x);
_$jscoverage['javascript-unaryop.js'][5]++;
x = (typeof x);
_$jscoverage['javascript-unaryop.js'][6]++;
x = (typeof 123);
_$jscoverage['javascript-unaryop.js'][7]++;
x = (void x);
