"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const StreamUtil_1 = require("./StreamUtil");
// Helper function to create a stream with numbers from start to end
function createNumberStream(start, end) {
    return new ReadableStream({
        start(controller) {
            for (let i = start; i <= end; i++) {
                controller.enqueue(i);
            }
            controller.close();
        },
    });
}
// Helper function to create an empty stream
function createEmptyStream() {
    return new ReadableStream({
        start(controller) {
            controller.close();
        },
    });
}
// Helper function to convert ReadableStream to array
function streamToArray(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        const reader = stream.getReader();
        const result = [];
        while (true) {
            const { done, value } = yield reader.read();
            if (done) {
                break;
            }
            result.push(value);
        }
        return result;
    });
}
// Helper function to create test stream
function createTestStream(items) {
    return new ReadableStream({
        start(controller) {
            for (const item of items) {
                controller.enqueue(item);
            }
            controller.close();
        },
    });
}
// Delay function (for simulating async operations)
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, ms));
    });
}
// Helper function to create a stream with numbers from start to end asynchronously
function createDelayedNumberStream(start, end, delayMs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Simulate async work
        yield delay(delayMs);
        return new ReadableStream({
            start(controller) {
                for (let i = start; i <= end; i++) {
                    controller.enqueue(i);
                }
                controller.close();
            },
        });
    });
}
// Helper function to create an empty stream asynchronously
function createEmptyDelayedStream(delayMs) {
    return __awaiter(this, void 0, void 0, function* () {
        // Simulate async work
        yield delay(delayMs);
        return new ReadableStream({
            start(controller) {
                controller.close();
            },
        });
    });
}
// Helper function to create a stream with items having various delay times
function createVariableDelayedNumberStream(items) {
    return __awaiter(this, void 0, void 0, function* () {
        // Wait for all items to be ready based on their delays
        yield Promise.all(items.map((item) => __awaiter(this, void 0, void 0, function* () { return delay(item.delay); })));
        return new ReadableStream({
            start(controller) {
                for (const item of items) {
                    controller.enqueue(item.value);
                }
                controller.close();
            },
        });
    });
}
describe("streamUtil", () => {
    describe("readAll", () => {
        it("should read all values from a stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createNumberStream(1, 5);
            const result = yield StreamUtil_1.StreamUtil.readAll(stream);
            expect(result).toEqual([1, 2, 3, 4, 5]);
        }));
        it("should return empty array for empty stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createEmptyStream();
            const result = yield StreamUtil_1.StreamUtil.readAll(stream);
            expect(result).toEqual([]);
        }));
        it("should handle error in stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(1);
                    controller.enqueue(2);
                    controller.error(new Error("Stream error"));
                },
            });
            yield expect(StreamUtil_1.StreamUtil.readAll(stream)).rejects.toThrow("Stream error");
        }));
        it("should handle null or undefined values in stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createTestStream([1, null, 3, undefined, 5]);
            const result = yield StreamUtil_1.StreamUtil.readAll(stream);
            expect(result).toEqual([1, null, 3, undefined, 5]);
        }));
    });
    describe("reduce", () => {
        it("should concatenate strings from number stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stringStream = createNumberStream(1, 3);
            const stringResult = yield StreamUtil_1.StreamUtil.reduce(stringStream, (acc, cur) => acc + cur.toString(), "");
            expect(stringResult).toBe("123");
        }));
        it("should sum numbers from stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const sumStream = createNumberStream(1, 5);
            const sumResult = yield StreamUtil_1.StreamUtil.reduce(sumStream, (acc, cur) => acc + cur, 0);
            expect(sumResult).toBe(15);
        }));
        it("should work without initial value", () => __awaiter(void 0, void 0, void 0, function* () {
            const noInitialStream = createNumberStream(1, 4);
            const noInitialResult = yield StreamUtil_1.StreamUtil.reduce(noInitialStream, (acc, cur) => acc + cur);
            expect(noInitialResult).toBe(10);
        }));
        it("should return initial value for empty stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const emptyStream = createEmptyStream();
            const emptyResult = yield StreamUtil_1.StreamUtil.reduce(emptyStream, (acc, cur) => acc + cur.toString(), "initial value");
            expect(emptyResult).toBe("initial value");
        }));
        it("should return null for empty stream without initial value", () => __awaiter(void 0, void 0, void 0, function* () {
            const emptyNoInitialStream = createEmptyStream();
            const emptyNoInitialResult = yield StreamUtil_1.StreamUtil.reduce(emptyNoInitialStream, (acc, cur) => acc + cur);
            expect(emptyNoInitialResult).toBeNull();
        }));
        it("should work with async generated stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stringStream = yield createDelayedNumberStream(1, 3, 10);
            const stringResult = yield StreamUtil_1.StreamUtil.reduce(stringStream, (acc, cur) => acc + cur.toString(), "");
            expect(stringResult).toBe("123");
        }));
        it("should work with async stream without initial value", () => __awaiter(void 0, void 0, void 0, function* () {
            const noInitialStream = yield createDelayedNumberStream(1, 4, 15);
            const noInitialResult = yield StreamUtil_1.StreamUtil.reduce(noInitialStream, (acc, cur) => acc + cur);
            expect(noInitialResult).toBe(10);
        }));
        it("should work with async stream transformation and aggregation into array", () => __awaiter(void 0, void 0, void 0, function* () {
            const transformStream = yield createDelayedNumberStream(1, 3, 10);
            const transformResult = yield StreamUtil_1.StreamUtil.reduce(transformStream, (acc, cur) => {
                if (typeof acc === "number") {
                    // Handle case when no initial value is provided
                    return [`item${acc}`, `item${cur}`];
                }
                return [...acc, `item${cur}`];
            }, []);
            expect(transformResult).toEqual(["item1", "item2", "item3"]);
        }));
        it("should return initial value for async generated empty stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const emptyStream = yield createEmptyDelayedStream(30);
            const emptyResult = yield StreamUtil_1.StreamUtil.reduce(emptyStream, (acc, cur) => acc + cur.toString(), "initial");
            expect(emptyResult).toBe("initial");
        }));
        it("should work with stream with values created with various async delays", () => __awaiter(void 0, void 0, void 0, function* () {
            const delayStream = yield createVariableDelayedNumberStream([
                { value: 1, delay: 20 },
                { value: 2, delay: 40 },
                { value: 3, delay: 10 },
            ]);
            const delayResult = yield StreamUtil_1.StreamUtil.reduce(delayStream, (acc, cur) => acc + cur, 0);
            expect(delayResult).toBe(6);
        }));
        it("should handle error in reducer function", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createNumberStream(1, 3);
            yield expect(StreamUtil_1.StreamUtil.reduce(stream, (acc, cur) => {
                if (cur === 2) {
                    throw new Error("Test error");
                }
                return acc + cur;
            }, 0)).rejects.toThrow("Test error");
        }));
        it("should handle null or undefined values in stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createTestStream([1, null, 3, undefined, 5]);
            const result = yield StreamUtil_1.StreamUtil.reduce(stream, (acc, cur) => (acc !== null && acc !== void 0 ? acc : 0) + (cur !== null && cur !== void 0 ? cur : 0), 0);
            expect(result).toBe(9); // 1 + 0 + 3 + 0 + 5 = 9
        }));
    });
    describe("from", () => {
        it("should create a stream with a single value", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = StreamUtil_1.StreamUtil.from("Hello, world!");
            const reader = stream.getReader();
            const { done, value } = yield reader.read();
            expect(done).toBe(false);
            expect(value).toBe("Hello, world!");
            const next = yield reader.read();
            expect(next.done).toBe(true);
        }));
        it("should handle null or undefined values", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = StreamUtil_1.StreamUtil.from(null);
            const reader = stream.getReader();
            const { done, value } = yield reader.read();
            expect(done).toBe(false);
            expect(value).toBeNull();
            const next = yield reader.read();
            expect(next.done).toBe(true);
        }));
    });
    describe("transform", () => {
        it("should transform number stream by doubling", () => __awaiter(void 0, void 0, void 0, function* () {
            const numbersInput = [1, 2, 3, 4, 5];
            const numberStream = createTestStream(numbersInput);
            const doubledStream = StreamUtil_1.StreamUtil.transform(numberStream, (num) => num * 2);
            const doubledResult = yield streamToArray(doubledStream);
            const expectedDoubled = numbersInput.map(n => n * 2);
            expect(doubledResult).toEqual(expectedDoubled);
        }));
        it("should transform object stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const objectsInput = [
                { name: "item1", value: 10 },
                { name: "item2", value: 20 },
                { name: "item3", value: 30 },
            ];
            const objectStream = createTestStream(objectsInput);
            const transformedObjectStream = StreamUtil_1.StreamUtil.transform(objectStream, obj => ({
                id: obj.name.toUpperCase(),
                doubledValue: obj.value * 2,
            }));
            const transformedObjects = yield streamToArray(transformedObjectStream);
            const expectedObjects = objectsInput.map(obj => ({
                id: obj.name.toUpperCase(),
                doubledValue: obj.value * 2,
            }));
            expect(transformedObjects).toEqual(expectedObjects);
        }));
        it("should handle empty stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const emptyStream = createEmptyStream();
            const transformedEmptyStream = StreamUtil_1.StreamUtil.transform(emptyStream, n => n * 2);
            const emptyResult = yield streamToArray(transformedEmptyStream);
            expect(emptyResult).toEqual([]);
        }));
        it("should transform type (number -> string)", () => __awaiter(void 0, void 0, void 0, function* () {
            const numbersInput = [1, 2, 3, 4, 5];
            const numberStream = createTestStream(numbersInput);
            const stringStream = StreamUtil_1.StreamUtil.transform(numberStream, num => `Number: ${num}`);
            const stringResult = yield streamToArray(stringStream);
            const expectedStrings = numbersInput.map(n => `Number: ${n}`);
            expect(stringResult).toEqual(expectedStrings);
        }));
        it("should handle error in transformer function", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createNumberStream(1, 3);
            const transformedStream = StreamUtil_1.StreamUtil.transform(stream, (num) => {
                if (num === 2) {
                    throw new Error("Transform error");
                }
                return num * 2;
            });
            yield expect(streamToArray(transformedStream)).rejects.toThrow("Transform error");
        }));
        it("should handle null or undefined values in stream", () => __awaiter(void 0, void 0, void 0, function* () {
            const stream = createTestStream([1, null, 3, undefined, 5]);
            const transformedStream = StreamUtil_1.StreamUtil.transform(stream, num => (num !== null && num !== void 0 ? num : 0) * 2);
            const result = yield streamToArray(transformedStream);
            expect(result).toEqual([2, 0, 6, 0, 10]);
        }));
    });
    describe("toAsyncGenerator", () => {
        it("should yield a single value", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const generator = (0, StreamUtil_1.toAsyncGenerator)("test value");
            const result = [];
            try {
                for (var _d = true, generator_1 = __asyncValues(generator), generator_1_1; generator_1_1 = yield generator_1.next(), _a = generator_1_1.done, !_a; _d = true) {
                    _c = generator_1_1.value;
                    _d = false;
                    const value = _c;
                    result.push(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_1.return)) yield _b.call(generator_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            expect(result).toEqual(["test value"]);
        }));
        it("should handle null or undefined values", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_2, _b, _c;
            const generator = (0, StreamUtil_1.toAsyncGenerator)(null);
            const result = [];
            try {
                for (var _d = true, generator_2 = __asyncValues(generator), generator_2_1; generator_2_1 = yield generator_2.next(), _a = generator_2_1.done, !_a; _d = true) {
                    _c = generator_2_1.value;
                    _d = false;
                    const value = _c;
                    result.push(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_2.return)) yield _b.call(generator_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            expect(result).toEqual([null]);
        }));
        it("should handle object values", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_3, _b, _c;
            const testObj = { id: 1, name: "test" };
            const generator = (0, StreamUtil_1.toAsyncGenerator)(testObj);
            const result = [];
            try {
                for (var _d = true, generator_3 = __asyncValues(generator), generator_3_1; generator_3_1 = yield generator_3.next(), _a = generator_3_1.done, !_a; _d = true) {
                    _c = generator_3_1.value;
                    _d = false;
                    const value = _c;
                    result.push(value);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_3.return)) yield _b.call(generator_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            expect(result).toEqual([testObj]);
        }));
    });
    describe("streamDefaultReaderToAsyncGenerator", () => {
        it("should convert stream reader to async generator", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_4, _b, _c;
            const stream = createNumberStream(1, 5);
            const reader = stream.getReader();
            const generator = (0, StreamUtil_1.streamDefaultReaderToAsyncGenerator)(reader);
            const result = [];
            try {
                for (var _d = true, generator_4 = __asyncValues(generator), generator_4_1; generator_4_1 = yield generator_4.next(), _a = generator_4_1.done, !_a; _d = true) {
                    _c = generator_4_1.value;
                    _d = false;
                    const value = _c;
                    result.push(value);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_4.return)) yield _b.call(generator_4);
                }
                finally { if (e_4) throw e_4.error; }
            }
            expect(result).toEqual([1, 2, 3, 4, 5]);
        }));
        it("should handle empty stream", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_5, _b, _c;
            const stream = createEmptyStream();
            const reader = stream.getReader();
            const generator = (0, StreamUtil_1.streamDefaultReaderToAsyncGenerator)(reader);
            const result = [];
            try {
                for (var _d = true, generator_5 = __asyncValues(generator), generator_5_1; generator_5_1 = yield generator_5.next(), _a = generator_5_1.done, !_a; _d = true) {
                    _c = generator_5_1.value;
                    _d = false;
                    const value = _c;
                    result.push(value);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_5.return)) yield _b.call(generator_5);
                }
                finally { if (e_5) throw e_5.error; }
            }
            expect(result).toEqual([]);
        }));
        it("should handle null or undefined values in stream", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_6, _b, _c;
            const stream = createTestStream([1, null, 3, undefined, 5]);
            const reader = stream.getReader();
            const generator = (0, StreamUtil_1.streamDefaultReaderToAsyncGenerator)(reader);
            const result = [];
            try {
                for (var _d = true, generator_6 = __asyncValues(generator), generator_6_1; generator_6_1 = yield generator_6.next(), _a = generator_6_1.done, !_a; _d = true) {
                    _c = generator_6_1.value;
                    _d = false;
                    const value = _c;
                    result.push(value);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = generator_6.return)) yield _b.call(generator_6);
                }
                finally { if (e_6) throw e_6.error; }
            }
            expect(result).toEqual([1, null, 3, undefined, 5]);
        }));
        it("should handle error in stream", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_7, _b, _c;
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(1);
                    controller.enqueue(2);
                    delay(1000).then(() => controller.error(new Error("Stream error"))).catch(() => { });
                },
            });
            const reader = stream.getReader();
            const generator = (0, StreamUtil_1.streamDefaultReaderToAsyncGenerator)(reader);
            const result = [];
            try {
                try {
                    for (var _d = true, generator_7 = __asyncValues(generator), generator_7_1; generator_7_1 = yield generator_7.next(), _a = generator_7_1.done, !_a; _d = true) {
                        _c = generator_7_1.value;
                        _d = false;
                        const value = _c;
                        result.push(value);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = generator_7.return)) yield _b.call(generator_7);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                // Should not reach here
                expect(true).toBe(false);
            }
            catch (error) {
                console.error(error);
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe("Stream error");
                expect(result).toEqual([1, 2]);
            }
        }));
    });
});
//# sourceMappingURL=StreamUtil.spec.js.map