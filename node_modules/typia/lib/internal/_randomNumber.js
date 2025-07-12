"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomNumber = void 0;
const _randomNumber = (schema) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const minimum = (_b = (_a = schema.minimum) !== null && _a !== void 0 ? _a : schema.exclusiveMinimum) !== null && _b !== void 0 ? _b : ((_c = schema.multipleOf) !== null && _c !== void 0 ? _c : 1) *
        (schema.maximum === undefined && schema.exclusiveMaximum === undefined
            ? 0
            : ((_d = schema.maximum) !== null && _d !== void 0 ? _d : schema.exclusiveMaximum) - 100);
    const maximum = (_f = (_e = schema.maximum) !== null && _e !== void 0 ? _e : schema.exclusiveMaximum) !== null && _f !== void 0 ? _f : ((_g = schema.multipleOf) !== null && _g !== void 0 ? _g : 1) *
        (schema.minimum === undefined && schema.exclusiveMinimum === undefined
            ? 100
            : ((_h = schema.minimum) !== null && _h !== void 0 ? _h : schema.exclusiveMinimum) + 100);
    if (minimum > maximum)
        throw new Error("Minimum value is greater than maximum value.");
    return schema.multipleOf === undefined
        ? scalar({
            minimum,
            maximum,
            exclusiveMinimum: schema.exclusiveMinimum !== undefined,
            exclusiveMaximum: schema.exclusiveMaximum !== undefined,
        })
        : multiple({
            minimum,
            maximum,
            multipleOf: schema.multipleOf,
            exclusiveMinimum: schema.exclusiveMinimum !== undefined,
            exclusiveMaximum: schema.exclusiveMaximum !== undefined,
        });
};
exports._randomNumber = _randomNumber;
const scalar = (p) => {
    if (p.minimum === p.maximum && (p.exclusiveMinimum || p.exclusiveMaximum))
        throw new Error(p.exclusiveMinimum
            ? "Exclusive minimum value equals maximum value."
            : "Exclusive maximum value equals minimum value.");
    while (true) {
        const value = Math.random() * (p.maximum - p.minimum) + p.minimum;
        if (p.exclusiveMinimum && value === p.minimum)
            continue;
        else if (p.exclusiveMaximum && value === p.maximum)
            continue;
        return value;
    }
};
const multiple = (p) => {
    let minimum = Math.ceil(p.minimum / p.multipleOf) * p.multipleOf;
    let maximum = Math.floor(p.maximum / p.multipleOf) * p.multipleOf;
    if (p.exclusiveMinimum === true && minimum % p.multipleOf === 0)
        minimum += p.multipleOf;
    if (p.exclusiveMaximum === true && maximum % p.multipleOf === 0)
        maximum -= p.multipleOf;
    if (minimum > maximum)
        throw new Error("The range of the integer is smaller than the multipleOf value.");
    const value = scalar({
        minimum,
        maximum,
        exclusiveMinimum: p.exclusiveMinimum,
        exclusiveMaximum: p.exclusiveMaximum,
    });
    return value - (value % p.multipleOf);
};
//# sourceMappingURL=_randomNumber.js.map