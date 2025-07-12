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
const MPSC_1 = require("./MPSC");
describe("the MPSC", () => {
    describe("basic functionality", () => {
        it("basic MPSC functionality test", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            const reader = mpsc.consumer.getReader();
            // Produce values
            mpsc.produce(10);
            mpsc.produce(20);
            mpsc.produce(30);
            const read1 = yield reader.read();
            const read2 = yield reader.read();
            const read3 = yield reader.read();
            expect(read1.value).toBe(10);
            expect(read1.done).toBe(false);
            expect(read2.value).toBe(20);
            expect(read2.done).toBe(false);
            expect(read3.value).toBe(30);
            expect(read3.done).toBe(false);
        }));
        it("close functionality test", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            const reader = mpsc.consumer.getReader();
            mpsc.produce(10);
            mpsc.close();
            yield reader.read();
            expect(mpsc.done()).toBe(true);
        }));
        it("multiple producers scenario test", () => __awaiter(void 0, void 0, void 0, function* () {
            const multiMpsc = new MPSC_1.MPSC();
            const multiReader = multiMpsc.consumer.getReader();
            // Simulate multiple producers
            for (let i = 1; i <= 5; i++) {
                multiMpsc.produce(`producer-${i}`);
            }
            // Read all values
            const multiResults = [];
            for (let i = 0; i < 5; i++) {
                const { value } = yield multiReader.read();
                if (value != null) {
                    multiResults.push(value);
                }
            }
            expect(multiResults.length).toBe(5);
            expect(multiResults).toContain("producer-1");
            expect(multiResults).toContain("producer-2");
            expect(multiResults).toContain("producer-3");
            expect(multiResults).toContain("producer-4");
            expect(multiResults).toContain("producer-5");
            multiMpsc.close();
            const multiAfterClose = yield multiReader.read();
            expect(multiAfterClose.done).toBe(true);
        }));
        it("reading before producing test", () => __awaiter(void 0, void 0, void 0, function* () {
            const delayMpsc = new MPSC_1.MPSC();
            const delayReader = delayMpsc.consumer.getReader();
            // Start reading before producing
            const readPromise = delayReader.read();
            // Produce after a small delay
            setTimeout(() => {
                delayMpsc.produce(42);
            }, 10);
            const delayResult = yield readPromise;
            expect(delayResult.value).toBe(42);
            expect(delayResult.done).toBe(false);
            delayMpsc.close();
        }));
        it("producer-first, then consumer test", () => __awaiter(void 0, void 0, void 0, function* () {
            const laterMpsc = new MPSC_1.MPSC();
            // Produce values first
            laterMpsc.produce("first");
            laterMpsc.produce("second");
            laterMpsc.produce("third");
            // Then get reader and read
            const laterReader = laterMpsc.consumer.getReader();
            const laterResult1 = yield laterReader.read();
            const laterResult2 = yield laterReader.read();
            const laterResult3 = yield laterReader.read();
            expect(laterResult1.value).toBe("first");
            expect(laterResult1.done).toBe(false);
            expect(laterResult2.value).toBe("second");
            expect(laterResult2.done).toBe(false);
            expect(laterResult3.value).toBe("third");
            expect(laterResult3.done).toBe(false);
            laterMpsc.close();
        }));
    });
    describe("waitClosed functionality", () => {
        it("basic waitClosed functionality test", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            const reader = mpsc.consumer.getReader();
            mpsc.produce("message");
            const readResult = yield reader.read();
            expect(readResult.value).toBe("message");
            expect(readResult.done).toBe(false);
            // Call waitClose then execute close
            const closePromise = mpsc.waitClosed();
            mpsc.close();
            yield closePromise; // Should resolve when closed
            const afterClose = yield reader.read();
            expect(afterClose.done).toBe(true);
        }));
        it("call waitClose on already closed queue test", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc2 = new MPSC_1.MPSC();
            mpsc2.close(); // Close first
            const alreadyClosedPromise = mpsc2.waitClosed();
            // Should resolve immediately since already closed
            yield alreadyClosedPromise;
        }));
        it("multiple waitClose calls test", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc3 = new MPSC_1.MPSC();
            // Create multiple waitClose promises
            const waitPromises = [mpsc3.waitClosed(), mpsc3.waitClosed(), mpsc3.waitClosed()];
            // All promises should resolve
            mpsc3.close();
            yield Promise.all(waitPromises);
        }));
        it("verify waitClose doesn't block other operations", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc4 = new MPSC_1.MPSC();
            const reader4 = mpsc4.consumer.getReader();
            // Call waitClose
            const waitPromise4 = mpsc4.waitClosed();
            // Check if value production and consumption still work
            mpsc4.produce("first");
            mpsc4.produce("second");
            const read1 = yield reader4.read();
            const read2 = yield reader4.read();
            expect(read1.value).toBe("first");
            expect(read1.done).toBe(false);
            expect(read2.value).toBe("second");
            expect(read2.done).toBe(false);
            mpsc4.close();
            yield waitPromise4;
            const afterClose4 = yield reader4.read();
            expect(afterClose4.done).toBe(true);
        }));
        it("waitClose resolution after async close test", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc5 = new MPSC_1.MPSC();
            const reader5 = mpsc5.consumer.getReader();
            mpsc5.produce(100);
            // Call waitClose
            const waitPromise5 = mpsc5.waitClosed();
            // Perform async close
            setTimeout(() => {
                mpsc5.close();
            }, 50);
            // Wait for waitClose to resolve
            yield waitPromise5;
            yield reader5.read();
            const afterClose5 = yield reader5.read();
            expect(afterClose5.done).toBe(true);
        }));
    });
    describe("waitUntilEmpty functionality", () => {
        it("waitUntilEmpty test when queue is empty", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            const reader = mpsc.consumer.getReader();
            // Should resolve immediately since queue is empty
            yield mpsc.waitUntilEmpty();
            mpsc.produce(1);
            const readResult = yield reader.read();
            expect(readResult.value).toBe(1);
            expect(readResult.done).toBe(false);
            mpsc.close();
        }));
        it("waitUntilEmpty test when queue is not empty", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            const reader = mpsc.consumer.getReader();
            mpsc.produce(1);
            mpsc.produce(2);
            // waitUntilEmpty should not resolve since queue is not empty
            const waitPromise = mpsc.waitUntilEmpty();
            // Read first value
            const read1 = yield reader.read();
            expect(read1.value).toBe(1);
            // Read second value
            const read2 = yield reader.read();
            expect(read2.value).toBe(2);
            mpsc.close();
            const read3 = yield reader.read();
            expect(read3.done).toBe(true);
            // Now queue is empty, waitUntilEmpty should resolve
            yield waitPromise;
        }));
        it("waitUntilEmpty test on closed queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            const reader = mpsc.consumer.getReader();
            mpsc.produce(1);
            mpsc.close();
            // waitUntilEmpty should resolve since queue is closed
            yield mpsc.waitUntilEmpty();
            const readResult = yield reader.read();
            expect(readResult.value).toBe(1);
            expect(readResult.done).toBe(false);
            const afterClose = yield reader.read();
            expect(afterClose.done).toBe(true);
        }));
    });
    describe("done functionality", () => {
        it("done test on unclosed queue", () => __awaiter(void 0, void 0, void 0, function* () {
            const mpsc = new MPSC_1.MPSC();
            expect(mpsc.done()).toBe(false);
            mpsc.produce(1);
            expect(mpsc.done()).toBe(false);
            mpsc.close();
            yield mpsc.consumer.getReader().read();
            expect(mpsc.done()).toBe(true);
        }));
    });
});
//# sourceMappingURL=MPSC.spec.js.map