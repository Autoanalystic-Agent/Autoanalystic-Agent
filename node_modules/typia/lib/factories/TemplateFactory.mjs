import ts from 'typescript';

var TemplateFactory;
(function (TemplateFactory) {
    TemplateFactory.generate = (expressions) => {
        if (expressions.every((exp) => ts.isStringLiteral(exp)))
            return ts.factory.createStringLiteral(expressions.map((str) => str.text).join(""));
        const iterator = {
            value: "",
            index: 0,
        };
        gather({
            expressions,
            iterator,
        });
        const head = ts.factory.createTemplateHead(iterator.value);
        const spans = [];
        while (true) {
            const elem = expressions[iterator.index++];
            gather({
                expressions,
                iterator,
            });
            const broken = iterator.index === expressions.length;
            spans.push(ts.factory.createTemplateSpan(elem, broken
                ? ts.factory.createTemplateTail(iterator.value)
                : ts.factory.createTemplateMiddle(iterator.value)));
            if (broken === true)
                break;
        }
        return ts.factory.createTemplateExpression(head, spans);
    };
    const gather = (props) => {
        const found = props.expressions.findIndex((elem, index) => index >= props.iterator.index && !ts.isStringLiteral(elem));
        const last = found !== -1 ? found : props.expressions.length;
        props.iterator.value = props.expressions
            .slice(props.iterator.index, last)
            .map((elem) => elem.text)
            .reduce((x, y) => x + y, "");
        props.iterator.index = last;
    };
})(TemplateFactory || (TemplateFactory = {}));

export { TemplateFactory };
//# sourceMappingURL=TemplateFactory.mjs.map
