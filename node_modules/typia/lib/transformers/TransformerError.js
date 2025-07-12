"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformerError = void 0;
const Escaper_1 = require("../utils/Escaper");
class TransformerError extends Error {
    constructor(props) {
        super(props.message);
        this.code = props.code;
        // INHERITANCE POLYFILL
        const proto = new.target.prototype;
        if (Object.setPrototypeOf)
            Object.setPrototypeOf(this, proto);
        else
            this.__proto__ = proto;
    }
}
exports.TransformerError = TransformerError;
(function (TransformerError) {
    TransformerError.from = (props) => {
        const body = props.errors
            .map((e) => {
            const subject = e.explore.object === null
                ? ""
                : join(e.explore.object)(e.explore.property);
            const middle = e.explore.parameter
                ? `(parameter: ${JSON.stringify(e.explore.parameter)})`
                : e.explore.output
                    ? "(return type)"
                    : "";
            const type = `${subject.length ? `${subject}: ` : ""}${e.name}`;
            return `- ${type}${middle}\n${e.messages
                .map((msg) => `  - ${msg}`)
                .join("\n")}`;
        })
            .join("\n\n");
        return new TransformerError({
            code: props.code,
            message: `unsupported type detected\n\n${body}`,
        });
    };
    const join = (object) => (key) => {
        if (key === null)
            return object.name;
        else if (typeof key === "object")
            return `${object.name}[key]`;
        else if (Escaper_1.Escaper.variable(key))
            return `${object.name}.${key}`;
        return `${object.name}[${JSON.stringify(key)}]`;
    };
})(TransformerError || (exports.TransformerError = TransformerError = {}));
//# sourceMappingURL=TransformerError.js.map