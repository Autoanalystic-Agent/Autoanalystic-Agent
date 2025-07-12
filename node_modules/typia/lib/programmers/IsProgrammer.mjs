import ts from 'typescript';
import { ExpressionFactory } from '../factories/ExpressionFactory.mjs';
import { IdentifierFactory } from '../factories/IdentifierFactory.mjs';
import { ValueFactory } from '../factories/ValueFactory.mjs';
import { CheckerProgrammer } from './CheckerProgrammer.mjs';
import { FeatureProgrammer } from './FeatureProgrammer.mjs';
import { FunctionProgrammer } from './helpers/FunctionProgrammer.mjs';
import { OptionPredicator } from './helpers/OptionPredicator.mjs';
import { check_object } from './internal/check_object.mjs';

var IsProgrammer;
(function (IsProgrammer) {
    IsProgrammer.configure = (props) => ({
        prefix: "_i",
        equals: !!props.options?.object,
        trace: false,
        path: false,
        numeric: OptionPredicator.numeric({
            numeric: props.options?.numeric,
        }),
        atomist: ({ entry }) => [
            ...(entry.expression ? [entry.expression] : []),
            ...(entry.conditions.length === 0
                ? []
                : [
                    entry.conditions
                        .map((set) => set
                        .map((s) => s.expression)
                        .reduce((a, b) => ts.factory.createLogicalAnd(a, b)))
                        .reduce((a, b) => ts.factory.createLogicalOr(a, b)),
                ]),
        ].reduce((x, y) => ts.factory.createLogicalAnd(x, y)),
        combiner: (next) => {
            const initial = next.logic === "and"
                ? ts.factory.createTrue()
                : ts.factory.createFalse();
            const binder = next.logic === "and"
                ? ts.factory.createLogicalAnd
                : ts.factory.createLogicalOr;
            return next.binaries.length
                ? next.binaries.map((binary) => binary.expression).reduce(binder)
                : initial;
        },
        joiner: {
            object: props.options?.object
                ? (v) => props.options.object(v)
                : (v) => check_object({
                    config: {
                        equals: !!props.options?.object,
                        undefined: OptionPredicator.undefined({
                            undefined: props.options?.undefined,
                        }),
                        assert: true,
                        reduce: ts.factory.createLogicalAnd,
                        positive: ts.factory.createTrue(),
                        superfluous: () => ts.factory.createFalse(),
                    },
                    context: props.context,
                    entries: v.entries,
                    input: v.input,
                }),
            array: (props) => ts.factory.createCallExpression(IdentifierFactory.access(props.input, "every"), undefined, [props.arrow]),
            failure: () => ts.factory.createFalse(),
        },
        success: ts.factory.createTrue(),
    });
    IsProgrammer.decompose = (props) => {
        // CONFIGURATION
        const config = {
            ...IsProgrammer.configure({
                options: {
                    object: (v) => check_object({
                        config: {
                            equals: props.config.equals,
                            undefined: OptionPredicator.undefined(props.context.options),
                            assert: true,
                            reduce: ts.factory.createLogicalAnd,
                            positive: ts.factory.createTrue(),
                            superfluous: () => ts.factory.createFalse(),
                        },
                        context: props.context,
                        entries: v.entries,
                        input: v.input,
                    }),
                    numeric: OptionPredicator.numeric(props.context.options),
                },
                context: props.context,
                functor: props.functor,
            }),
            trace: props.config.equals,
        };
        // COMPOSITION
        const composed = CheckerProgrammer.compose({
            ...props,
            config,
        });
        return {
            functions: composed.functions,
            statements: composed.statements,
            arrow: ts.factory.createArrowFunction(undefined, undefined, composed.parameters, composed.response, undefined, composed.body),
        };
    };
    IsProgrammer.write = (props) => {
        const functor = new FunctionProgrammer(props.modulo.getText());
        const result = IsProgrammer.decompose({
            config: props.config,
            context: props.context,
            functor,
            type: props.type,
            name: props.name,
        });
        return FeatureProgrammer.writeDecomposed({
            modulo: props.modulo,
            functor,
            result,
        });
    };
    IsProgrammer.write_function_statements = (props) => {
        const config = IsProgrammer.configure(props);
        const next = {
            ...props,
            config,
        };
        const objects = CheckerProgrammer.write_object_functions(next);
        const unions = CheckerProgrammer.write_union_functions(next);
        const arrays = CheckerProgrammer.write_array_functions(next);
        const tuples = CheckerProgrammer.write_tuple_functions(next);
        return [
            ...objects.filter((_, i) => props.functor.hasLocal(`${config.prefix}o${i}`)),
            ...unions.filter((_, i) => props.functor.hasLocal(`${config.prefix}u${i}`)),
            ...arrays.filter((_, i) => props.functor.hasLocal(`${config.prefix}a${i}`)),
            ...tuples.filter((_, i) => props.functor.hasLocal(`${config.prefix}t${i}`)),
        ];
    };
    /* -----------------------------------------------------------
      DECODERS
    ----------------------------------------------------------- */
    IsProgrammer.decode = (props) => CheckerProgrammer.decode({
        context: props.context,
        config: IsProgrammer.configure(props),
        functor: props.functor,
        metadata: props.metadata,
        input: props.input,
        explore: props.explore,
    });
    IsProgrammer.decode_object = (props) => CheckerProgrammer.decode_object({
        config: IsProgrammer.configure(props),
        functor: props.functor,
        object: props.object,
        input: props.input,
        explore: props.explore,
    });
    IsProgrammer.decode_to_json = (props) => ts.factory.createLogicalAnd(ExpressionFactory.isObject({
        checkArray: false,
        checkNull: props.checkNull,
        input: props.input,
    }), ts.factory.createStrictEquality(ts.factory.createStringLiteral("function"), ValueFactory.TYPEOF(IdentifierFactory.access(props.input, "toJSON"))));
    IsProgrammer.decode_functional = (input) => ts.factory.createStrictEquality(ts.factory.createStringLiteral("function"), ValueFactory.TYPEOF(input));
})(IsProgrammer || (IsProgrammer = {}));

export { IsProgrammer };
//# sourceMappingURL=IsProgrammer.mjs.map
