module = QUnit.module

test("Dependency module required as a namespace object", function() {
    strictEqual(typeof testns1 != "undefined", true);
    equal(typeof testns1.extend, "function");
});

test("Dependency file required as a namespace object", function() {
    strictEqual(typeof testns2 != "undefined", true);
    equal(typeof testns2.whereFrom, "function");
    equal(testns2.whereFrom(), "I was required as a namespace object");
});

test("Dependency file required as global", function() {
    equal(typeof whereFrom, "function");
    equal(whereFrom(), "I was required as global");
});
