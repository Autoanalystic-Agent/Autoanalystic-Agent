import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { ValidateProgrammer } from '../ValidateProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { MiscCloneProgrammer } from './MiscCloneProgrammer.mjs';

var MiscValidateCloneProgrammer;
(function (MiscValidateCloneProgrammer) {
    MiscValidateCloneProgrammer.decompose = (props) => {
        const validate = ValidateProgrammer.decompose({
            ...props,
            config: {
                equals: false,
            },
        });
        const clone = MiscCloneProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...validate.functions,
                ...clone.functions,
            },
            statements: [
                ...validate.statements,
                ...clone.statements,
                StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory.constant({
                    name: "__clone",
                    value: clone.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [clone.arrow.type ?? TypeFactory.keyword("any")],
            }), undefined, ts.factory.createBlock([
                StatementFactory.constant({
                    name: "result",
                    value: ts.factory.createAsExpression(ts.factory.createCallExpression(ts.factory.createIdentifier("__validate"), undefined, [ts.factory.createIdentifier("input")]), TypeFactory.keyword("any")),
                }),
                ts.factory.createIfStatement(ts.factory.createIdentifier("result.success"), ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(ts.factory.createIdentifier("result.data"), ts.SyntaxKind.EqualsToken, ts.factory.createCallExpression(ts.factory.createIdentifier("__clone"), undefined, [ts.factory.createIdentifier("input")])))),
                ts.factory.createReturnStatement(ts.factory.createIdentifier("result")),
            ], true)),
        };
    };
    MiscValidateCloneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = MiscValidateCloneProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscValidateCloneProgrammer || (MiscValidateCloneProgrammer = {}));

export { MiscValidateCloneProgrammer };
//# sourceMappingURL=MiscValidateCloneProgrammer.mjs.map
