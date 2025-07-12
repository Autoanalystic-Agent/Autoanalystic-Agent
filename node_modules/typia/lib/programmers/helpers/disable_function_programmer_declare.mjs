const disable_function_programmer_declare = (functor) => disable(functor);
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

export { disable_function_programmer_declare };
//# sourceMappingURL=disable_function_programmer_declare.mjs.map
