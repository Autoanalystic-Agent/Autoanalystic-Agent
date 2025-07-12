"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__map_take = __map_take;
/**
 * @internal
 */
function __map_take(dict, key, generator) {
    const oldbie = dict.get(key);
    if (oldbie !== undefined) {
        return oldbie;
    }
    const value = generator();
    dict.set(key, value);
    return value;
}
//# sourceMappingURL=__map_take.js.map