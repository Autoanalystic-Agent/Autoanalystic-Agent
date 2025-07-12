import ts from 'typescript';

var ValueFactory;
(function (ValueFactory) {
    ValueFactory.NULL = () => ts.factory.createNull();
    ValueFactory.UNDEFINED = () => ts.factory.createIdentifier("undefined");
    ValueFactory.BOOLEAN = (value) => value ? ts.factory.createTrue() : ts.factory.createFalse();
    ValueFactory.INPUT = (str = "input") => ts.factory.createIdentifier(str);
    ValueFactory.TYPEOF = (input) => ts.factory.createTypeOfExpression(input);
})(ValueFactory || (ValueFactory = {}));

export { ValueFactory };
//# sourceMappingURL=ValueFactory.mjs.map
