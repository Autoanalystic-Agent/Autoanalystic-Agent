"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = check;
exports.checks = checks;
/**
 * Check or test the validity of a type
 * @param debug to debug with parameter hints (`ctrl+p`, `ctrl+shift+space`)
 * @example
 * ```ts
 * // see in `tst` folder
 * ```
 */
function check(debug) {
    if (debug !== undefined) {
        // eslint-disable-next-line no-console
        console.log(debug);
    }
    return 1;
}
/**
 * Validates a batch of [[check]]
 * @param _checks a batch of [[check]]
 * @example
 * ```ts
 * // see in `tst` folder
 * ```
 */
function checks(_checks) { }
//# sourceMappingURL=types.js.map