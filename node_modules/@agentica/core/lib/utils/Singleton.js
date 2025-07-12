"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
/**
 * @internal
 */
const NOT_MOUNTED_YET = {};
/**
 * @internal
 *
 * @description
 * A singleton class that creates a single instance of a class.
 *
 * @example
 * ```ts
 * const singleton = new Singleton((name: string) => new SomeClass(name));
 * const instance = singleton.get("test");
 * ```
 *
 * but next case is not work
 * ```ts
 * const singleton = new Singleton((name: string) => new SomeClass(name));
 * const instance = singleton.get("test");
 * const instance2 = singleton.get("test2");
 *
 * expect(instance).toBe(instance2); // true
 * ```
 */
class Singleton {
    constructor(closure) {
        this.closure_ = closure;
        this.value_ = NOT_MOUNTED_YET;
    }
    get(...args) {
        if (this.value_ === NOT_MOUNTED_YET) {
            this.value_ = this.closure_(...args);
        }
        return this.value_;
    }
}
exports.Singleton = Singleton;
//# sourceMappingURL=Singleton.js.map