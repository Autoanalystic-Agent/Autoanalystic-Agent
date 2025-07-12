"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomInteger = void 0;
const _randomInteger = (schema) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let minimum = (_b = (_a = schema.minimum) !== null && _a !== void 0 ? _a : schema.exclusiveMinimum) !== null && _b !== void 0 ? _b : ((_c = schema.multipleOf) !== null && _c !== void 0 ? _c : 1) *
        (schema.maximum === undefined && schema.exclusiveMaximum === undefined
            ? 0
            : ((_d = schema.maximum) !== null && _d !== void 0 ? _d : schema.exclusiveMaximum) - 100);
    if (schema.exclusiveMinimum !== undefined)
        minimum++;
    let maximum = (_f = (_e = schema.maximum) !== null && _e !== void 0 ? _e : schema.exclusiveMaximum) !== null && _f !== void 0 ? _f : ((_g = schema.multipleOf) !== null && _g !== void 0 ? _g : 1) *
        (schema.minimum === undefined && schema.exclusiveMinimum === undefined
            ? 100
            : ((_h = schema.minimum) !== null && _h !== void 0 ? _h : schema.exclusiveMinimum) + 100);
    if (schema.exclusiveMaximum !== undefined)
        maximum--;
    if (minimum > maximum)
        throw new Error("Minimum value is greater than maximum value.");
    return schema.multipleOf === undefined
        ? scalar({
            minimum,
            maximum,
        })
        : multiple({
            minimum,
            maximum,
            multipleOf: schema.multipleOf,
        });
};
exports._randomInteger = _randomInteger;
const scalar = (p) => Math.floor(Math.random() * (p.maximum - p.minimum + 1)) + p.minimum;
const multiple = (p) => {
    const minimum = Math.ceil(p.minimum / p.multipleOf) * p.multipleOf;
    const maximum = Math.floor(p.maximum / p.multipleOf) * p.multipleOf;
    if (minimum > maximum)
        throw new Error("The range of the integer is smaller than the multipleOf value.");
    const value = scalar({
        minimum,
        maximum,
    });
    return value - (value % p.multipleOf);
};
//# sourceMappingURL=_randomInteger.js.map