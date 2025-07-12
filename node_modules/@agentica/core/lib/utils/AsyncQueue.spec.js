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
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncQueue_1 = require("./AsyncQueue");
describe("the AsyncQueue", () => {
    describe("basic functionality", () => {
        it("enqueue and dequeue test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Enqueue items
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            // Dequeue items
            const result1 = yield queue.dequeue();
            const result2 = yield queue.dequeue();
            const result3 = yield queue.dequeue();
            expect(result1.value).toBe(1);
            expect(result1.done).toBe(false);
            expect(result2.value).toBe(2);
            expect(result2.done).toBe(false);
            expect(result3.value).toBe(3);
            expect(result3.done).toBe(false);
        }));
        it("isEmpty test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            expect(queue.isEmpty()).toBe(true);
            queue.enqueue(1);
            expect(queue.isEmpty()).toBe(false);
            yield queue.dequeue();
            expect(queue.isEmpty()).toBe(true);
        }));
        it("isClosed test", () => {
            const queue = new AsyncQueue_1.AsyncQueue();
            expect(queue.isClosed()).toBe(false);
            queue.close();
            expect(queue.isClosed()).toBe(true);
        });
        it("done test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            expect(queue.done()).toBe(false);
            queue.enqueue(1);
            expect(queue.done()).toBe(false);
            yield queue.dequeue();
            expect(queue.done()).toBe(false);
            queue.close();
            expect(queue.done()).toBe(true);
        }));
    });
    describe("close functionality", () => {
        it("close test with empty queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.close();
            const result = yield queue.dequeue();
            expect(result.done).toBe(true);
            expect(result.value).toBeUndefined();
        }));
        it("close test with non-empty queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.enqueue(1);
            queue.enqueue(2);
            queue.close();
            const result1 = yield queue.dequeue();
            const result2 = yield queue.dequeue();
            const result3 = yield queue.dequeue();
            expect(result1.value).toBe(1);
            expect(result1.done).toBe(false);
            expect(result2.value).toBe(2);
            expect(result2.done).toBe(false);
            expect(result3.done).toBe(true);
            expect(result3.value).toBeUndefined();
        }));
        it("close test with waiting dequeue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Start dequeue before enqueue
            const dequeuePromise = queue.dequeue();
            // Close the queue
            queue.close();
            const result = yield dequeuePromise;
            expect(result.done).toBe(true);
            expect(result.value).toBeUndefined();
        }));
    });
    describe("waitUntilEmpty functionality", () => {
        it("waitUntilEmpty test with empty queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Should resolve immediately since queue is empty
            yield queue.waitUntilEmpty();
            queue.enqueue(1);
            const result = yield queue.dequeue();
            expect(result.value).toBe(1);
            expect(result.done).toBe(false);
        }));
        it("waitUntilEmpty test with non-empty queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.enqueue(1);
            queue.enqueue(2);
            // waitUntilEmpty should not resolve since queue is not empty
            const waitPromise = queue.waitUntilEmpty();
            // Dequeue first value
            const result1 = yield queue.dequeue();
            expect(result1.value).toBe(1);
            // Dequeue second value
            const result2 = yield queue.dequeue();
            expect(result2.value).toBe(2);
            // Now queue is empty, waitUntilEmpty should resolve\
            yield waitPromise;
        }));
    });
    describe("waitClosed functionality", () => {
        it("waitClosed test with unclosed queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // waitClosed should not resolve since queue is not closed
            const waitPromise = queue.waitClosed();
            queue.enqueue(1);
            const result = yield queue.dequeue();
            expect(result.value).toBe(1);
            // Close the queue
            queue.close();
            // Now queue is closed, waitClosed should resolve
            yield waitPromise;
        }));
        it("waitClosed test with already closed queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.close();
            // waitClosed should resolve immediately since queue is already closed
            yield queue.waitClosed();
        }));
        it("multiple waitClosed calls test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Create multiple waitClosed promises
            const waitPromises = [queue.waitClosed(), queue.waitClosed(), queue.waitClosed()];
            // Close the queue
            queue.close();
            // All promises should resolve
            yield Promise.all(waitPromises);
        }));
        it("waitClosed test with delayed close", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Start waiting for close
            const closePromise = queue.waitClosed();
            // Close after delay
            setTimeout(() => {
                queue.close();
            }, 10);
            yield closePromise; // Should resolve when queue is closed
        }));
    });
    describe("dequeue behavior", () => {
        it("dequeue before enqueue test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Start dequeue before enqueue
            const dequeuePromise = queue.dequeue();
            // Enqueue after a small delay
            setTimeout(() => {
                queue.enqueue(42);
            }, 10);
            const result = yield dequeuePromise;
            expect(result.value).toBe(42);
            expect(result.done).toBe(false);
        }));
        it("multiple dequeue calls test", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const queue = new AsyncQueue_1.AsyncQueue();
            // Start multiple dequeue calls
            const dequeuePromises = [
                queue.dequeue(),
                queue.dequeue(),
                queue.dequeue(),
            ];
            // Enqueue values
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            const results = yield Promise.all(dequeuePromises);
            expect((_a = results[0]) === null || _a === void 0 ? void 0 : _a.value).toBe(1);
            expect((_b = results[0]) === null || _b === void 0 ? void 0 : _b.done).toBe(false);
            expect((_c = results[1]) === null || _c === void 0 ? void 0 : _c.value).toBe(2);
            expect((_d = results[1]) === null || _d === void 0 ? void 0 : _d.done).toBe(false);
            expect((_e = results[2]) === null || _e === void 0 ? void 0 : _e.value).toBe(3);
            expect((_f = results[2]) === null || _f === void 0 ? void 0 : _f.done).toBe(false);
        }));
        it("dequeue after close test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.enqueue(1);
            queue.close();
            const result1 = yield queue.dequeue();
            expect(result1.value).toBe(1);
            expect(result1.done).toBe(false);
            const result2 = yield queue.dequeue();
            expect(result2.done).toBe(true);
            expect(result2.value).toBeUndefined();
        }));
        it("duplicate dequeue test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            // Start dequeue operation that will wait for an item
            const pendingDequeue = queue.dequeue();
            // Add item after a small delay
            setTimeout(() => {
                queue.enqueue("delayed item");
            }, 10);
            const delayedResult = yield pendingDequeue;
            expect(delayedResult.value).toBe("delayed item");
            expect(delayedResult.done).toBe(false);
            // Check for duplicate dequeue
            const duplicatedResult = yield Promise.race([
                queue.dequeue(),
                new Promise(resolve => setTimeout(resolve, 0, false)),
            ]);
            // If duplicatedResult is false, it means the race timed out (expected)
            // If it's an IteratorResult, it should not have the same value
            if (duplicatedResult !== false) {
                expect(duplicatedResult.value).not.toBe("delayed item");
            }
        }));
    });
    describe("edge cases and error handling", () => {
        it("enqueue after close test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.close();
            queue.enqueue(1); // Should still work, but dequeue will return done: true
            const result = yield queue.dequeue();
            expect(result.done).toBe(true);
            expect(result.value).toBeUndefined();
        }));
        it("multiple close calls test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.close();
            queue.close(); // Second close should not cause issues
            const result = yield queue.dequeue();
            expect(result.done).toBe(true);
            expect(result.value).toBeUndefined();
        }));
        it("waitUntilEmpty with multiple calls test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            queue.enqueue(1);
            // Create multiple waitUntilEmpty promises
            const waitPromises = [queue.waitUntilEmpty(), queue.waitUntilEmpty()];
            // Dequeue the value
            yield queue.dequeue();
            // All promises should resolve
            yield Promise.all(waitPromises);
        }));
        it("concurrent enqueue and dequeue test", () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new AsyncQueue_1.AsyncQueue();
            const results = [];
            // Start multiple dequeue operations
            const dequeuePromises = Array.from({ length: 5 }).fill(0).map(() => __awaiter(void 0, void 0, void 0, function* () { return queue.dequeue(); }));
            // Enqueue values with small delays
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    queue.enqueue(i);
                }, i * 10);
            }
            // Wait for all dequeue operations to complete
            const dequeuedResults = yield Promise.all(dequeuePromises);
            // Collect values
            dequeuedResults.forEach((result) => {
                if (result.value !== undefined) {
                    results.push(result.value);
                }
            });
            // Check that all values were dequeued
            expect(results.length).toBe(5);
            expect(results).toContain(0);
            expect(results).toContain(1);
            expect(results).toContain(2);
            expect(results).toContain(3);
            expect(results).toContain(4);
        }));
    });
});
//# sourceMappingURL=AsyncQueue.spec.js.map