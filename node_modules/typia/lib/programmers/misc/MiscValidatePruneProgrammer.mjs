import ts from 'typescript';
import { IdentifierFactory } from '../../factories/IdentifierFactory.mjs';
import { StatementFactory } from '../../factories/StatementFactory.mjs';
import { TypeFactory } from '../../factories/TypeFactory.mjs';
import { FeatureProgrammer } from '../FeatureProgrammer.mjs';
import { ValidateProgrammer } from '../ValidateProgrammer.mjs';
import { FunctionProgrammer } from '../helpers/FunctionProgrammer.mjs';
import { MiscPruneProgrammer } from './MiscPruneProgrammer.mjs';

var MiscValidatePruneProgrammer;
(function (MiscValidatePruneProgrammer) {
    MiscValidatePruneProgrammer.decompose = (props) => {
        const validate = ValidateProgrammer.decompose({
            ...props,
            config: {
                equals: false,
            },
        });
        const prune = MiscPruneProgrammer.decompose({
            ...props,
            validated: true,
        });
        return {
            functions: {
                ...validate.functions,
                ...prune.functions,
            },
            statements: [
                ...validate.statements,
                ...prune.statements,
                StatementFactory.constant({
                    name: "__validate",
                    value: validate.arrow,
                }),
                StatementFactory.constant({
                    name: "__prune",
                    value: prune.arrow,
                }),
            ],
            arrow: ts.factory.createArrowFunction(undefined, undefined, [IdentifierFactory.parameter("input", TypeFactory.keyword("any"))], props.context.importer.type({
                file: "typia",
                name: "IValidation",
                arguments: [
                    ts.factory.createTypeReferenceNode(props.name ??
                        TypeFactory.getFullName({
                            checker: props.context.checker,
                            type: props.type,
                        })),
                ],
            }), undefined, ts.factory.createBlock([
                StatementFactory.constant({
                    name: "result",
                    value: ts.factory.createCallExpression(ts.factory.createIdentifier("__validate"), undefined, [ts.factory.createIdentifier("input")]),
                }),
                ts.factory.createIfStatement(ts.factory.createIdentifier("result.success"), ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier("__prune"), undefined, [ts.factory.createIdentifier("input")]))),
                ts.factory.createReturnStatement(ts.factory.createIdentifier("result")),
            ], true)),
        };
    };
    MiscValidatePruneProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = MiscValidatePruneProgrammer.decompose({
            ...props,
            functor,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
})(MiscValidatePruneProgrammer || (MiscValidatePruneProgrammer = {}));

export { MiscValidatePruneProgrammer };
//# sourceMappingURL=MiscValidatePruneProgrammer.mjs.map
