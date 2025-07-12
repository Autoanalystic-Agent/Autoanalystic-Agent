var ArrayUtil;
(function (ArrayUtil) {
    ArrayUtil.has = (array, pred) => array.some(pred);
    ArrayUtil.add = (array, value, pred = (x, y) => x === y) => {
        if (array.some((elem) => pred(elem, value)))
            return false;
        array.push(value);
        return true;
    };
    ArrayUtil.set = (array, value, key) => {
        if (array.some((elem) => key(elem) === key(value)))
            return;
        array.push(value);
    };
    ArrayUtil.take = (array, pred, init) => {
        const index = array.findIndex(pred);
        if (index !== -1)
            return array[index];
        const elem = init();
        array.push(elem);
        return elem;
    };
    ArrayUtil.repeat = (count, closure) => new Array(count).fill("").map((_, index) => closure(index, count));
})(ArrayUtil || (ArrayUtil = {}));

export { ArrayUtil };
//# sourceMappingURL=ArrayUtil.mjs.map
