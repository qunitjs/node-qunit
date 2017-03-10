test('1', function (assert){
    assert.ok(true, "tests intermixing sync and async tests #1");
});

test('a', function(assert){
    var done = assert.async();

    setTimeout(function() {
        assert.ok(true, 'test a1');
        assert.ok(true, 'test a2');
        done();
    }, 100);
});

test('2', function (assert){
    assert.ok(true, "tests intermixing sync and async tests #2");
});

test('b', function(assert){
    var done = assert.async();

    setTimeout(function() {
        assert.ok(true, 'test b1');
        assert.ok(true, 'test b2');
        done();
    }, 10);
});
