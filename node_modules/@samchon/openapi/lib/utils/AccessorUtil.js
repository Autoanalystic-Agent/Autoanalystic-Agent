"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessorUtil = void 0;
var AccessorUtil;
(function (AccessorUtil) {
    AccessorUtil.reference = (prefix) => prefix
        .split("/")
        .filter((str, i) => !!str.length && !(i === 0 && str === "#"))
        .join(".");
})(AccessorUtil || (exports.AccessorUtil = AccessorUtil = {}));
