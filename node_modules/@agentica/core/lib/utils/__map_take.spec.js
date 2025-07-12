"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __map_take_1 = require("./__map_take");
describe("__map_take", () => {
    describe("basic functionality", () => {
        it("should generate value for new key", () => {
            const map = new Map();
            const generator = () => 42;
            const result = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result).toBe(42);
            expect(map.get("test")).toBe(42);
        });
        it("should return existing value for existing key", () => {
            const map = new Map();
            map.set("test", 100);
            const generator = () => 42;
            const result = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result).toBe(100);
            expect(map.get("test")).toBe(100);
        });
    });
    describe("various type tests", () => {
        it("should handle object type", () => {
            const map = new Map();
            const generator = () => ({ value: 42 });
            const result = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result).toEqual({ value: 42 });
            expect(map.get("test")).toEqual({ value: 42 });
        });
        it("should handle array type", () => {
            const map = new Map();
            const generator = () => [1, 2, 3];
            const result = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result).toEqual([1, 2, 3]);
            expect(map.get("test")).toEqual([1, 2, 3]);
        });
        it("should handle function type", () => {
            var _a;
            const map = new Map();
            const generator = () => () => 42;
            const result = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result()).toBe(42);
            expect((_a = map.get("test")) === null || _a === void 0 ? void 0 : _a()).toBe(42);
        });
    });
    describe("edge cases", () => {
        it("should handle null key", () => {
            const map = new Map();
            const generator = () => "test";
            const result = (0, __map_take_1.__map_take)(map, null, generator);
            expect(result).toBe("test");
            expect(map.get(null)).toBe("test");
        });
        it("should handle undefined key", () => {
            const map = new Map();
            const generator = () => "test";
            const result = (0, __map_take_1.__map_take)(map, undefined, generator);
            expect(result).toBe("test");
            expect(map.get(undefined)).toBe("test");
        });
        it("should handle empty string key", () => {
            const map = new Map();
            const generator = () => "test";
            const result = (0, __map_take_1.__map_take)(map, "", generator);
            expect(result).toBe("test");
            expect(map.get("")).toBe("test");
        });
    });
    describe("generator function tests", () => {
        it("should not call generator multiple times", () => {
            const map = new Map();
            let callCount = 0;
            const generator = () => {
                callCount++;
                return 42;
            };
            (0, __map_take_1.__map_take)(map, "test", generator);
            (0, __map_take_1.__map_take)(map, "test", generator);
            expect(callCount).toBe(1);
        });
        it("should handle generator throwing error", () => {
            const map = new Map();
            const generator = () => {
                throw new Error("Generator error");
            };
            expect(() => (0, __map_take_1.__map_take)(map, "test", generator)).toThrow("Generator error");
        });
        it("should handle generator returning undefined", () => {
            const map = new Map();
            const generator = () => undefined;
            const result = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result).toBeUndefined();
            expect(map.get("test")).toBeUndefined();
        });
    });
    describe("concurrency tests", () => {
        it("should handle concurrent access to same key", () => {
            const map = new Map();
            const generator = () => 42;
            const result1 = (0, __map_take_1.__map_take)(map, "test", generator);
            const result2 = (0, __map_take_1.__map_take)(map, "test", generator);
            expect(result1).toBe(42);
            expect(result2).toBe(42);
            expect(map.get("test")).toBe(42);
        });
    });
});
//# sourceMappingURL=__map_take.spec.js.map