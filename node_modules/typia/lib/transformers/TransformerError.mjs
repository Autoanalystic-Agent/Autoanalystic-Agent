import { Escaper } from '../utils/Escaper.mjs';

class TransformerError extends Error {
    code;
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
        else if (Escaper.variable(key))
            return `${object.name}.${key}`;
        return `${object.name}[${JSON.stringify(key)}]`;
    };
})(TransformerError || (TransformerError = {}));

export { TransformerError };
//# sourceMappingURL=TransformerError.mjs.map
