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
exports.MPSC = void 0;
const AsyncQueue_1 = require("./AsyncQueue");
class MPSC {
    constructor() {
        this.queue = new AsyncQueue_1.AsyncQueue();
        this.consumer = new ReadableStream({
            pull: (controller) => __awaiter(this, void 0, void 0, function* () {
                const { value, done } = yield this.queue.dequeue();
                if (done === true) {
                    controller.close();
                    return;
                }
                controller.enqueue(value);
            }),
        });
    }
    produce(chunk) {
        this.queue.enqueue(chunk);
    }
    close() {
        this.queue.close();
    }
    done() {
        return this.queue.done();
    }
    waitClosed() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queue.waitClosed();
        });
    }
    waitUntilEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.queue.waitUntilEmpty();
        });
    }
}
exports.MPSC = MPSC;
//# sourceMappingURL=MPSC.js.map