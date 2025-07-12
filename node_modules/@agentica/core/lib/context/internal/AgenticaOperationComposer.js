"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgenticaOperationComposer = void 0;
exports.compose = compose;
exports.getOperations = getOperations;
exports.toHttpOperations = toHttpOperations;
exports.toClassOperations = toClassOperations;
exports.toMcpOperations = toMcpOperations;
exports.divide = divide;
const __map_take_1 = require("../../utils/__map_take");
/**
 * Compose the agentica operation collection.
 *
 * Compose the {@link AgenticaOperationCollection} from the given
 * controllers and config.
 *
 * @internal
 */
function compose(props) {
    var _a;
    const unique = (props.controllers.length === 1 || (() => {
        const names = props.controllers.map(controllers => controllers.application.functions.map((func) => func.name)).flat();
        return new Set(names).size === names.length;
    })());
    const array = getOperations({
        controllers: props.controllers,
        naming: (func, controllerIndex) => unique ? func : `_${controllerIndex}_${func}`,
    });
    const capacity = (_a = props.config) === null || _a === void 0 ? void 0 : _a.capacity;
    const divided = capacity !== undefined && array.length > capacity
        ? divide({
            array,
            capacity,
        })
        : undefined;
    const flat = new Map();
    const group = new Map();
    for (const item of array) {
        flat.set(item.name, item);
        (0, __map_take_1.__map_take)(group, item.controller.name, () => new Map()).set(item.name, item);
    }
    return {
        array,
        divided,
        flat,
        group,
    };
}
/**
 * @internal
 */
function getOperations(props) {
    return props.controllers.flatMap((controller, idx) => {
        switch (controller.protocol) {
            case "http": {
                return toHttpOperations({ controller, index: idx, naming: props.naming });
            }
            case "class": {
                return toClassOperations({ controller, index: idx, naming: props.naming });
            }
            case "mcp": {
                return toMcpOperations({ controller, index: idx, naming: props.naming });
            }
            default:
                controller;
                throw new Error(`Unsupported protocol: ${controller.protocol}`);
        }
    });
}
/**
 * @internal
 */
function toHttpOperations(props) {
    return props.controller.application.functions.map(func => ({
        protocol: "http",
        controller: props.controller,
        function: func,
        name: props.naming(func.name, props.index),
        toJSON: () => ({
            protocol: "http",
            controller: props.controller.name,
            function: func.name,
            name: props.naming(func.name, props.index),
        }),
    }));
}
/**
 * @internal
 */
function toClassOperations(props) {
    return props.controller.application.functions.map(func => ({
        protocol: "class",
        controller: props.controller,
        function: func,
        name: props.naming(func.name, props.index),
        toJSON: () => ({
            protocol: "class",
            controller: props.controller.name,
            function: func.name,
            name: props.naming(func.name, props.index),
        }),
    }));
}
/**
 * @internal
 */
function toMcpOperations(props) {
    return props.controller.application.functions.map(func => ({
        protocol: "mcp",
        controller: props.controller,
        function: func,
        name: props.naming(func.name, props.index),
        toJSON: () => ({
            protocol: "mcp",
            controller: props.controller.name,
            function: func.name,
            name: props.naming(func.name, props.index),
        }),
    }));
}
/**
 * @internal
 */
function divide(props) {
    if (props.capacity <= 0) {
        throw new Error("Capacity must be a positive integer");
    }
    if (Number.isNaN(props.capacity)) {
        throw new TypeError("Capacity must be a positive integer");
    }
    if (props.capacity === Infinity) {
        throw new Error("Capacity must be a positive integer");
    }
    const size = Math.ceil(props.array.length / props.capacity);
    const capacity = Math.ceil(props.array.length / size);
    const replica = props.array.slice();
    return Array.from({ length: size }, () => replica.splice(0, capacity));
}
exports.AgenticaOperationComposer = {
    compose,
};
//# sourceMappingURL=AgenticaOperationComposer.js.map