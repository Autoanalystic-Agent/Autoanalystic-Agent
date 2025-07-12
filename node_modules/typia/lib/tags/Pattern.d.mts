import { TagBase } from "./TagBase";
export type Pattern<Value extends string> = TagBase<{
    target: "string";
    kind: "pattern";
    value: Value;
    validate: `RegExp("${Serialize<Value>}").test($input)`;
    exclusive: ["format", "pattern"];
    schema: {
        pattern: Value;
    };
}>;
type Serialize<T extends string, Output extends string = ""> = string extends T ? never : T extends "" ? Output : T extends `${infer P}${infer R}` ? Serialize<R, `${Output}${P extends keyof Escaper ? Escaper[P] : P}`> : never;
type Escaper = {
    '"': '\\"';
    "\\": "\\\\";
    "\b": "\\b";
    "\f": "\\f";
    "\n": "\\n";
    "\r": "\\r";
    "\t": "\\t";
};
export {};
