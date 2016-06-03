test('generators', function* (assert) {
    var data = yield thunk();
    assert.deepEqual(data, {a: 1}, 'woks');
});
