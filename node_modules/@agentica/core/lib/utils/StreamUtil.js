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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamUtil = void 0;
exports.toAsyncGenerator = toAsyncGenerator;
exports.streamDefaultReaderToAsyncGenerator = streamDefaultReaderToAsyncGenerator;
/**
 * @module StreamUtil
 *
 * Utility functions for streams.
 */
function readAll(stream) {
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
function reduce(stream, reducer, initial) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const reader = stream.getReader();
        const iterator = streamDefaultReaderToAsyncGenerator(reader);
        let acc = (initial !== null && initial !== void 0 ? initial : null);
        try {
            for (var _d = true, iterator_1 = __asyncValues(iterator), iterator_1_1; iterator_1_1 = yield iterator_1.next(), _a = iterator_1_1.done, !_a; _d = true) {
                _c = iterator_1_1.value;
                _d = false;
                const value = _c;
                if (acc === null) {
                    acc = value;
                    continue;
                }
                acc = reducer(acc, value);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = iterator_1.return)) yield _b.call(iterator_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return acc;
    });
}
function from(value) {
    const stream = new ReadableStream({
        start: (controller) => {
            controller.enqueue(value);
            controller.close();
        },
    });
    return stream;
}
function toAsyncGenerator(value) {
    return __asyncGenerator(this, arguments, function* toAsyncGenerator_1() {
        yield yield __await(value);
    });
}
function streamDefaultReaderToAsyncGenerator(reader) {
    return __asyncGenerator(this, arguments, function* streamDefaultReaderToAsyncGenerator_1() {
        while (true) {
            const { done, value } = yield __await(reader.read());
            if (done) {
                break;
            }
            yield yield __await(value);
        }
    });
}
function transform(stream, transformer) {
    const reader = stream.getReader();
    return new ReadableStream({
        pull: (controller) => __awaiter(this, void 0, void 0, function* () {
            const { done, value } = yield reader.read();
            if (!done) {
                controller.enqueue(transformer(value));
            }
            else {
                controller.close();
            }
        }),
    });
}
exports.StreamUtil = {
    readAll,
    reduce,
    from,
    transform,
};
//# sourceMappingURL=StreamUtil.js.map