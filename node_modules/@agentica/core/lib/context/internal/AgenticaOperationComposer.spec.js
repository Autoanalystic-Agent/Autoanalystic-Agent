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
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const inMemory_1 = require("@modelcontextprotocol/sdk/inMemory");
const calculator_mcp_1 = require("@wrtnlabs/calculator-mcp");
const assertMcpController_1 = require("../../functional/assertMcpController");
const AgenticaOperationComposer_1 = require("./AgenticaOperationComposer");
const client = new index_js_1.Client({
    name: "calculator",
    version: "1.0.0",
});
// test helper functions
function createMockHttpFunction(name, method, path) {
    return {
        name,
        method,
        path,
        validate: () => ({ success: true, data: {} }),
        operation: () => ({}),
        route: () => ({
            method,
            path,
            emendedPath: path,
            accessor: [name],
            body: null,
            query: null,
            parameters: [],
            headers: null,
            success: null,
            exceptions: {},
            comment: () => "OK",
            operation: () => ({}),
        }),
        parameters: {},
        output: {},
    };
}
function createMockHttpController(name, functions) {
    return {
        name,
        protocol: "http",
        connection: { host: "https://example.com" },
        application: {
            model: "chatgpt",
            options: {},
            functions,
            errors: [],
        },
    };
}
function createMockClassController(name, functions) {
    return {
        name,
        protocol: "class",
        application: {
            model: "chatgpt",
            options: {},
            functions,
        },
        execute: {},
    };
}
function createMockMcpController(name, functions) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = yield (0, assertMcpController_1.assertMcpController)({
            model: "chatgpt",
            name,
            client,
        });
        return Object.assign(Object.assign({}, controller), { application: Object.assign(Object.assign({}, controller.application), { functions }) });
    });
}
describe("a AgenticaOperationComposer", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const server = yield (0, calculator_mcp_1.createServer)({
            name: "calculator",
            version: "1.0.0",
        });
        const [clientTransport, serverTransport] = inMemory_1.InMemoryTransport.createLinkedPair();
        yield Promise.all([
            client.connect(clientTransport),
            server.connect(serverTransport),
        ]);
    }));
    describe("compose", () => {
        it("should compose operations from controllers", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock controllers
            const mockHttpController = createMockHttpController("httpController", [
                createMockHttpFunction("function1", "get", "/api/function1"),
                createMockHttpFunction("function2", "post", "/api/function2"),
            ]);
            const mockClassController = createMockClassController("classController", [
                {
                    name: "function3",
                    validate: () => ({ success: true, data: {} }),
                    parameters: {},
                    output: {},
                },
            ]);
            const mockMcpController = yield createMockMcpController("mcpController", [
                {
                    name: "function4",
                    parameters: {
                        type: "object",
                        properties: {},
                        additionalProperties: false,
                        required: [],
                        $defs: {},
                    },
                    validate: (data) => ({
                        success: true,
                        data,
                    }),
                },
            ]);
            const controllers = [mockHttpController, mockClassController, mockMcpController];
            const result = (0, AgenticaOperationComposer_1.compose)({ controllers });
            expect(result.array).toHaveLength(4);
            expect(result.flat).toBeInstanceOf(Map);
            expect(result.group).toBeInstanceOf(Map);
            expect(result.divided).toBeUndefined();
        }));
        it("should divide operations when capacity is provided", () => {
            // Mock controllers
            const mockController = createMockHttpController("httpController", [
                createMockHttpFunction("function1", "get", "/api/function1"),
                createMockHttpFunction("function2", "post", "/api/function2"),
                createMockHttpFunction("function3", "put", "/api/function3"),
                createMockHttpFunction("function4", "delete", "/api/function4"),
                createMockHttpFunction("function5", "patch", "/api/function5"),
            ]);
            const config = {
                capacity: 2,
            };
            const result = (0, AgenticaOperationComposer_1.compose)({ controllers: [mockController], config });
            expect(result.array).toHaveLength(5);
            expect(result.divided).toBeDefined();
            expect(result.divided).toHaveLength(3); // 5 items with capacity 2 should be divided into 3 groups
        });
    });
    describe("getOperations", () => {
        it("should get operations from http controllers", () => {
            var _a, _b, _c;
            const mockController = createMockHttpController("httpController", [
                createMockHttpFunction("function1", "get", "/api/function1"),
                createMockHttpFunction("function2", "post", "/api/function2"),
            ]);
            const result = (0, AgenticaOperationComposer_1.getOperations)({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` });
            expect(result).toHaveLength(2);
            expect((_a = result[0]) === null || _a === void 0 ? void 0 : _a.protocol).toBe("http");
            expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.name).toBe("_0_function1");
            expect((_c = result[1]) === null || _c === void 0 ? void 0 : _c.name).toBe("_0_function2");
        });
        it("should get operations from class controllers", () => {
            var _a, _b;
            const mockController = createMockClassController("classController", [
                {
                    name: "function1",
                    validate: () => ({ success: true, data: {} }),
                    parameters: {},
                    output: {},
                },
            ]);
            const result = (0, AgenticaOperationComposer_1.getOperations)({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` });
            expect(result).toHaveLength(1);
            expect((_a = result[0]) === null || _a === void 0 ? void 0 : _a.protocol).toBe("class");
            expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.name).toBe("_0_function1");
        });
        it("should get operations from mcp controllers", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const mockController = yield createMockMcpController("mcpController", [
                {
                    name: "function1",
                    parameters: {
                        type: "object",
                        properties: {},
                        additionalProperties: false,
                        required: [],
                        $defs: {},
                    },
                    validate: (data) => ({
                        success: true,
                        data,
                    }),
                },
            ]);
            const result = (0, AgenticaOperationComposer_1.getOperations)({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` });
            expect(result).toHaveLength(1);
            expect((_a = result[0]) === null || _a === void 0 ? void 0 : _a.protocol).toBe("mcp");
            expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.name).toBe("_0_function1");
        }));
        it("should throw error for unsupported protocol", () => {
            const mockController = {
                name: "unsupportedController",
                protocol: "unsupported",
                connection: { host: "https://example.com" },
                application: {},
            };
            expect(() => (0, AgenticaOperationComposer_1.getOperations)({ controllers: [mockController], naming: (func, idx) => `_${idx}_${func}` })).toThrow("Unsupported protocol: unsupported");
        });
    });
    describe("toHttpOperations", () => {
        it("should convert http controller to operations", () => {
            var _a, _b, _c;
            const mockController = createMockHttpController("httpController", [
                createMockHttpFunction("function1", "get", "/api/function1"),
                createMockHttpFunction("function2", "post", "/api/function2"),
            ]);
            const result = (0, AgenticaOperationComposer_1.toHttpOperations)({ controller: mockController, index: 0, naming: (func, idx) => `_${idx}_${func}` });
            expect(result).toHaveLength(2);
            expect((_a = result[0]) === null || _a === void 0 ? void 0 : _a.protocol).toBe("http");
            expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.name).toBe("_0_function1");
            expect((_c = result[1]) === null || _c === void 0 ? void 0 : _c.name).toBe("_0_function2");
        });
    });
    describe("toClassOperations", () => {
        it("should convert class controller to operations", () => {
            var _a, _b;
            const mockController = createMockClassController("classController", [
                {
                    name: "function1",
                    validate: () => ({ success: true, data: {} }),
                    parameters: {},
                    output: {},
                },
            ]);
            const result = (0, AgenticaOperationComposer_1.toClassOperations)({ controller: mockController, index: 0, naming: (func, idx) => `_${idx}_${func}` });
            expect(result).toHaveLength(1);
            expect((_a = result[0]) === null || _a === void 0 ? void 0 : _a.protocol).toBe("class");
            expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.name).toBe("_0_function1");
        });
    });
    describe("toMcpOperations", () => {
        it("should convert mcp controller to operations", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const mockController = yield createMockMcpController("mcpController", [
                {
                    name: "function1",
                    parameters: {
                        type: "object",
                        properties: {},
                        additionalProperties: false,
                        required: [],
                        $defs: {},
                    },
                    validate: (data) => ({
                        success: true,
                        data,
                    }),
                },
            ]);
            const result = (0, AgenticaOperationComposer_1.toMcpOperations)({ controller: mockController, index: 0, naming: (func, idx) => `_${idx}_${func}` });
            expect(result).toHaveLength(1);
            expect((_a = result[0]) === null || _a === void 0 ? void 0 : _a.protocol).toBe("mcp");
            expect((_b = result[0]) === null || _b === void 0 ? void 0 : _b.name).toBe("_0_function1");
        }));
    });
    describe("divide with invalid capacity", () => {
        it("should throw error when capacity is 0", () => {
            const array = [1, 2, 3, 4, 5];
            const capacity = 0;
            expect(() => (0, AgenticaOperationComposer_1.divide)({ array, capacity })).toThrow("Capacity must be a positive integer");
        });
        it("should throw error when capacity is negative", () => {
            const array = [1, 2, 3, 4, 5];
            const capacity = -3;
            expect(() => (0, AgenticaOperationComposer_1.divide)({ array, capacity })).toThrow("Capacity must be a positive integer");
        });
        it("should throw error when capacity is decimal", () => {
            const array = [1, 2, 3, 4, 5];
            const capacity = 2.5;
            const result = (0, AgenticaOperationComposer_1.divide)({ array, capacity });
            expect(result).toEqual([[1, 2, 3], [4, 5]]);
        });
        it("should throw error when capacity is Infinity", () => {
            const array = [1, 2, 3, 4, 5];
            const capacity = Infinity;
            expect(() => (0, AgenticaOperationComposer_1.divide)({ array, capacity })).toThrow("Capacity must be a positive integer");
        });
        it("should throw error when capacity is NaN", () => {
            const array = [1, 2, 3, 4, 5];
            const capacity = Number.NaN;
            expect(() => (0, AgenticaOperationComposer_1.divide)({ array, capacity })).toThrow("Capacity must be a positive integer");
        });
    });
    describe("divide", () => {
        it("should divide array into chunks based on capacity", () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const capacity = 3;
            const result = (0, AgenticaOperationComposer_1.divide)({ array, capacity });
            expect(result).toHaveLength(4); // 10 items with capacity 3 should be divided into 4 groups
            expect(result[0]).toEqual([1, 2, 3]);
            expect(result[1]).toEqual([4, 5, 6]);
            expect(result[2]).toEqual([7, 8, 9]);
            expect(result[3]).toEqual([10]);
        });
        it("should handle empty array", () => {
            const array = [];
            const capacity = 3;
            const result = (0, AgenticaOperationComposer_1.divide)({ array, capacity });
            expect(result).toHaveLength(0);
        });
        it("should handle array smaller than capacity", () => {
            const array = [1, 2];
            const capacity = 3;
            const result = (0, AgenticaOperationComposer_1.divide)({ array, capacity });
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual([1, 2]);
        });
    });
});
//# sourceMappingURL=AgenticaOperationComposer.spec.js.map