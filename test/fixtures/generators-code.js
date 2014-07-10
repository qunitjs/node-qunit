exports.getMyGen = function() {
    return function* () {
        return yield {a: 1};
    };
};
