import ts from 'typescript';
import { MetadataConstant } from '../../../schemas/metadata/MetadataConstant.mjs';
import { MetadataConstantValue } from '../../../schemas/metadata/MetadataConstantValue.mjs';
import { ArrayUtil } from '../../../utils/ArrayUtil.mjs';
import { CommentFactory } from '../../CommentFactory.mjs';

const iterate_metadata_constant = (props) => {
    if (!props.options.constant)
        return false;
    const filter = (flag) => (props.type.getFlags() & flag) !== 0;
    const comment = () => {
        if (!filter(ts.TypeFlags.EnumLiteral))
            return {};
        return {
            jsDocTags: props.type.symbol?.getJsDocTags(),
            description: props.type.symbol
                ? (CommentFactory.description(props.type.symbol) ?? null)
                : undefined,
        };
    };
    if (props.type.isLiteral()) {
        const value = typeof props.type.value === "object"
            ? BigInt(`${props.type.value.negative ? "-" : ""}${props.type.value.base10Value}`)
            : props.type.value;
        const constant = ArrayUtil.take(props.metadata.constants, (elem) => elem.type === typeof value, () => MetadataConstant.create({
            type: typeof value,
            values: [],
        }));
        ArrayUtil.add(constant.values, MetadataConstantValue.create({
            value,
            tags: [],
            ...comment(),
        }), (a, b) => a.value === b.value);
        return true;
    }
    else if (filter(ts.TypeFlags.BooleanLiteral)) {
        comment();
        const value = props.checker.typeToString(props.type) === "true";
        const constant = ArrayUtil.take(props.metadata.constants, (elem) => elem.type === "boolean", () => MetadataConstant.create({
            type: "boolean",
            values: [],
        }));
        ArrayUtil.add(constant.values, MetadataConstantValue.create({
            value,
            tags: [],
            ...comment(),
        }), (a, b) => a.value === b.value);
        return true;
    }
    return false;
};

export { iterate_metadata_constant };
//# sourceMappingURL=iterate_metadata_constant.mjs.map
