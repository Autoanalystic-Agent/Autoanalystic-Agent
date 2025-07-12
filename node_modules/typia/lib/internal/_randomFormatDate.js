"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._randomFormatDate = void 0;
const _randomInteger_1 = require("./_randomInteger");
const _randomFormatDate = (props) => {
    var _a, _b;
    return new Date((0, _randomInteger_1._randomInteger)({
        type: "integer",
        minimum: (_a = props === null || props === void 0 ? void 0 : props.minimum) !== null && _a !== void 0 ? _a : 0,
        maximum: ((_b = props === null || props === void 0 ? void 0 : props.maximum) !== null && _b !== void 0 ? _b : (props === null || props === void 0 ? void 0 : props.minimum) === undefined)
            ? Date.now()
            : props.minimum + 365 * 24 * 60 * 60 * 1000,
    }))
        .toISOString()
        .substring(0, 10);
};
exports._randomFormatDate = _randomFormatDate;
//# sourceMappingURL=_randomFormatDate.js.map