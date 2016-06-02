QUnit.test('myMethod test', function(assert) {
    assert.equal(myMethod(), 123, 'myMethod returns right result');
    assert.equal(myMethod(), 321, 'this should trigger an error');
});

QUnit.test('myAsyncMethod test', function(assert) {
    var done = assert.async();
    assert.expect(3);

    assert.ok(true, 'myAsyncMethod started');

    myAsyncMethod(function(data) {
        assert.equal(data, 123, 'myAsyncMethod returns right result');
        assert.equal(data, 321, 'this should trigger an error');
        done();
    });
});

QUnit.test('circular reference', function(assert) {
    assert.equal(global, global, 'test global');
});

QUnit.test('use original Date', function(assert) {
    var timekeeper = require('timekeeper');

    timekeeper.travel(Date.now() - 1000000);

    assert.ok(true, 'date modified');
});
