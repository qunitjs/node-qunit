test("Dependency file required as global", function(assert) {
    assert.equal(typeof whereFrom, "function");
    assert.equal(whereFrom(), "I was required as global");
});
