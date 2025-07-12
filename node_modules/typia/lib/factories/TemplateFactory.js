"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateFactory = void 0;
const typescript_1 = __importDefault(require("typescript"));
var TemplateFactory;
(function (TemplateFactory) {
    TemplateFactory.generate = (expressions) => {
        if (expressions.every((exp) => typescript_1.default.isStringLiteral(exp)))
            return typescript_1.default.factory.createStringLiteral(expressions.map((str) => str.text).join(""));
        const iterator = {
            value: "",
            index: 0,
        };
        gather({
            expressions,
            iterator,
        });
        const head = typescript_1.default.factory.createTemplateHead(iterator.value);
        const spans = [];
        while (true) {
            const elem = expressions[iterator.index++];
            gather({
                expressions,
                iterator,
            });
            const broken = iterator.index === expressions.length;
            spans.push(typescript_1.default.factory.createTemplateSpan(elem, broken
                ? typescript_1.default.factory.createTemplateTail(iterator.value)
                : typescript_1.default.factory.createTemplateMiddle(iterator.value)));
            if (broken === true)
                break;
        }
        return typescript_1.default.factory.createTemplateExpression(head, spans);
    };
    const gather = (props) => {
        const found = props.expressions.findIndex((elem, index) => index >= props.iterator.index && !typescript_1.default.isStringLiteral(elem));
        const last = found !== -1 ? found : props.expressions.length;
        props.iterator.value = props.expressions
            .slice(props.iterator.index, last)
            .map((elem) => elem.text)
            .reduce((x, y) => x + y, "");
        props.iterator.index = last;
    };
})(TemplateFactory || (exports.TemplateFactory = TemplateFactory = {}));
//# sourceMappingURL=TemplateFactory.js.map