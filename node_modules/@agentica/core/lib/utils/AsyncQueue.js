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
exports.AsyncQueue = exports.AsyncQueueClosedError = void 0;
class AsyncQueueClosedError extends Error {
    constructor(message) {
        super(message);
        this.name = "AsyncQueueClosedError";
    }
}
exports.AsyncQueueClosedError = AsyncQueueClosedError;
class AsyncQueue {
    constructor() {
        this.queue = [];
        this.resolvers = [];
        this.closeResolvers = [];
        this.emptyResolvers = [];
        this.closed = false;
    }
    enqueue(item) {
        var _a;
        if (this.closed) {
            console.error(new AsyncQueueClosedError("Cannot enqueue item: queue is closed."));
            return;
        }
        this.queue.push(item);
        if (this.resolvers.length > 0) {
            (_a = this.resolvers.shift()) === null || _a === void 0 ? void 0 : _a({ value: this.queue.shift(), done: false });
        }
    }
    dequeue() {
        return __awaiter(this, void 0, void 0, function* () {
            const item = (() => {
                if (!this.isEmpty()) {
                    return { value: this.queue.shift(), done: false };
                }
                if (this.isClosed()) {
                    return { value: undefined, done: true };
                }
                return null;
            })();
            if (this.isEmpty() && this.emptyResolvers.length !== 0) {
                this.emptyResolvers.forEach(resolve => resolve());
                this.emptyResolvers = [];
            }
            if (item !== null) {
                return item;
            }
            return new Promise(resolve => this.resolvers.push(resolve));
        });
    }
    isEmpty() {
        return this.queue.length === 0;
    }
    isClosed() {
        return this.closed;
    }
    done() {
        return this.isClosed() && this.isEmpty();
    }
    close() {
        var _a;
        this.closed = true;
        while (this.resolvers.length > 0) {
            (_a = this.resolvers.shift()) === null || _a === void 0 ? void 0 : _a({ value: undefined, done: true });
        }
        this.closeResolvers.forEach(resolve => resolve());
    }
    /**
     * Wait until the queue is empty
     *
     * if the queue is closed, it will not resolve promise
     * this function only check the queue is empty
     * @returns A promise that resolves when the queue is empty
     */
    waitUntilEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isEmpty()) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                this.emptyResolvers.push(resolve);
            });
        });
    }
    waitClosed() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isClosed()) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                this.closeResolvers.push(resolve);
            });
        });
    }
}
exports.AsyncQueue = AsyncQueue;
//# sourceMappingURL=AsyncQueue.js.map