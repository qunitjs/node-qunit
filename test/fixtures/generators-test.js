/* eslint-env es6 */
/* global thunk */
test('generators', function* (assert) {
    var data = yield thunk();
    assert.deepEqual(data, {a: 1}, 'works');
});
