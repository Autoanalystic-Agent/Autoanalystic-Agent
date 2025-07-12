"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable_function_programmer_declare = void 0;
const disable_function_programmer_declare = (functor) => disable(functor);
exports.disable_function_programmer_declare = disable_function_programmer_declare;
const disable = (functor) => ({
    method: functor.method,
    useLocal: (name) => functor.useLocal(name),
    hasLocal: (name) => functor.hasLocal(name),
    declare: () => [],
    declareUnions: () => [],
    increment: () => functor.increment(),
    emplaceUnion: (prefix, name, factory) => functor.emplaceUnion(prefix, name, factory),
    emplaceVariable: (key, value) => functor.emplaceVariable(key, value),
});
//# sourceMappingURL=disable_function_programmer_declare.js.map