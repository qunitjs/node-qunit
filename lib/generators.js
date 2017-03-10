'use strict'

var supported;

try {
  eval("(function *(){})()");
  supported = true;
} catch(err) {
  supported = false;
}

/**
 * Is true when generators are supported.
 */
exports.support = supported;

/**
 * Returns true if function is a generator fn.
 *
 * @param {Function} fn
 * @return {Boolean}
 */
exports.isGeneratorFn = function(fn) {
    return fn.constructor.name == 'GeneratorFunction';
}
