test("Dependency file required as a namespace object", function(assert) {
    assert.strictEqual(typeof testns != "undefined", true);
    assert.equal(typeof testns.whereFrom, "function", "right method attached to right object");
    assert.equal(testns.whereFrom(), "I was required as a namespace object");
});
