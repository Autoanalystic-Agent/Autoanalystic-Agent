"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionProgrammer = void 0;
const typescript_1 = __importDefault(require("typescript"));
const StatementFactory_1 = require("../../factories/StatementFactory");
class FunctionProgrammer {
    constructor(method) {
        this.method = method;
        this.local_ = new Set();
        this.unions_ = new Map();
        this.variables_ = new Map();
        this.sequence_ = 0;
    }
    useLocal(name) {
        this.local_.add(name);
        return name;
    }
    hasLocal(name) {
        return this.local_.has(name);
    }
    declare(includeUnions = true) {
        return [
            ...[...this.variables_.entries()].map(([name, value]) => StatementFactory_1.StatementFactory.constant({ name, value })),
            ...(includeUnions === true
                ? [...this.unions_.values()].map(([name, value]) => StatementFactory_1.StatementFactory.constant({ name, value }))
                : []),
        ];
    }
    declareUnions() {
        return [...this.unions_.values()].map(([name, value]) => StatementFactory_1.StatementFactory.constant({ name, value }));
    }
    increment() {
        return ++this.sequence_;
    }
    emplaceUnion(prefix, name, factory) {
        const key = `${prefix}::${name}`;
        const oldbie = this.unions_.get(key);
        if (oldbie)
            return oldbie[0];
        const index = this.unions_.size;
        const accessor = `${prefix}p${index}`;
        const tuple = [accessor, null];
        this.unions_.set(key, tuple);
        tuple[1] = factory();
        return accessor;
    }
    emplaceVariable(name, value) {
        this.variables_.set(name, value);
        return typescript_1.default.factory.createIdentifier(name);
    }
}
exports.FunctionProgrammer = FunctionProgrammer;
//# sourceMappingURL=FunctionProgrammer.js.map