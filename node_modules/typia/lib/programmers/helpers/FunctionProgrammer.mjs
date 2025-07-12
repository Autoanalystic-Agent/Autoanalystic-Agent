import ts from 'typescript';
import { StatementFactory } from '../../factories/StatementFactory.mjs';

class FunctionProgrammer {
    method;
    local_ = new Set();
    unions_ = new Map();
    variables_ = new Map();
    sequence_ = 0;
    constructor(method) {
        this.method = method;
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
            ...[...this.variables_.entries()].map(([name, value]) => StatementFactory.constant({ name, value })),
            ...(includeUnions === true
                ? [...this.unions_.values()].map(([name, value]) => StatementFactory.constant({ name, value }))
                : []),
        ];
    }
    declareUnions() {
        return [...this.unions_.values()].map(([name, value]) => StatementFactory.constant({ name, value }));
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
        return ts.factory.createIdentifier(name);
    }
}

export { FunctionProgrammer };
//# sourceMappingURL=FunctionProgrammer.mjs.map
