import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { ValidateProgrammer } from '../ValidateProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { NotationGeneralProgrammer } from './NotationGeneralProgrammer.mjs';

var NotationValidateGeneralProgrammer;
(function (NotationValidateGeneralProgrammer) {
    NotationValidateGeneralProgrammer.decompose = (props) => {
        const validate = ValidateProgrammer.decompose({
            ...props,
            config: {
                equals: false,
            },
        });
        const notation = NotationGeneralProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...validate.functions,
                ...notation.functions,
            },
            statements: [
                ...validate.statements,
                ...notation.statements,
                StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory.constant({
                    name: "__notation",
                    value: notation.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [notation.arrow.type ?? TypeFactory.keyword("any")],
            }), undefined, ts.factory.createBlock([
                StatementFactory.constant({
                    name: "result",
                    value: ts.factory.createAsExpression(ts.factory.createCallExpression(ts.factory.createIdentifier("__validate"), undefined, [ts.factory.createIdentifier("input")]), TypeFactory.keyword("any")),
                }),
                ts.factory.createIfStatement(ts.factory.createIdentifier("result.success"), ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(ts.factory.createIdentifier("result.data"), ts.SyntaxKind.EqualsToken, ts.factory.createCallExpression(ts.factory.createIdentifier("__notation"), undefined, [ts.factory.createIdentifier("input")])))),
                ts.factory.createReturnStatement(ts.factory.createAsExpression(ts.factory.createIdentifier("result"), TypeFactory.keyword("any"))),
            ], true)),
        };
    };
    NotationValidateGeneralProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = NotationValidateGeneralProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(NotationValidateGeneralProgrammer || (NotationValidateGeneralProgrammer = {}));

export { NotationValidateGeneralProgrammer };
//# sourceMappingURL=NotationValidateGeneralProgrammer.mjs.map
