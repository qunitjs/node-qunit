'use strict'

/**
 * Is true when generators are supported.
 *
 * @deprecated since node-qunit 2.0.0: This is always true.
 */
exports.support = true;

/**
 * Returns true if function is a generator fn.
 *
 * @param {Function} fn
 * @return {Boolean}
 */
exports.isGeneratorFn = function(fn) {
    return fn.constructor.name == 'GeneratorFunction';
}
