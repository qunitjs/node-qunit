test('generators', function* () {
    var data = yield getMyGen();
    deepEqual(data, {a: 1}, 'woks');
});
