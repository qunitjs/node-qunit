test('myMethod test', function(assert) {
    assert.equal(myMethod(), 123, 'myMethod returns right result');
});

test('myAsyncMethod test', function(assert) {
    assert.ok(true, 'myAsyncMethod started');

    var done = assert.async();
    assert.expect(2);

    myAsyncMethod(function(data) {
        assert.equal(data, 123, 'myAsyncMethod returns right result');
        done();
    });
});
