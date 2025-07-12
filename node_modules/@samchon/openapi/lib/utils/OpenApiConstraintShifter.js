"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiConstraintShifter = void 0;
const OpenApiExclusiveEmender_1 = require("./OpenApiExclusiveEmender");
var OpenApiConstraintShifter;
(function (OpenApiConstraintShifter) {
    OpenApiConstraintShifter.shiftArray = (schema) => {
        const tags = [];
        if (schema.minItems !== undefined) {
            tags.push(`@minItems ${schema.minItems}`);
            delete schema.minItems;
        }
        if (schema.maxItems !== undefined) {
            tags.push(`@maxItems ${schema.maxItems}`);
            delete schema.maxItems;
        }
        if (schema.uniqueItems !== undefined) {
            if (schema.uniqueItems === true)
                tags.push(`@uniqueItems`);
            delete schema.uniqueItems;
        }
        schema.description = writeTagWithDescription({
            description: schema.description,
            tags,
        });
        return schema;
    };
    OpenApiConstraintShifter.shiftNumeric = (schema) => {
        Object.assign(OpenApiExclusiveEmender_1.OpenApiExclusiveEmender.emend(schema));
        const tags = [];
        if (schema.minimum !== undefined) {
            tags.push(`@minimum ${schema.minimum}`);
            delete schema.minimum;
        }
        if (schema.maximum !== undefined) {
            tags.push(`@maximum ${schema.maximum}`);
            delete schema.maximum;
        }
        if (schema.exclusiveMinimum !== undefined) {
            tags.push(`@exclusiveMinimum ${schema.exclusiveMinimum}`);
            delete schema.exclusiveMinimum;
        }
        if (schema.exclusiveMaximum !== undefined) {
            tags.push(`@exclusiveMaximum ${schema.exclusiveMaximum}`);
            delete schema.exclusiveMaximum;
        }
        if (schema.multipleOf !== undefined) {
            tags.push(`@multipleOf ${schema.multipleOf}`);
            delete schema.multipleOf;
        }
        schema.description = writeTagWithDescription({
            description: schema.description,
            tags,
        });
        if (schema.default !== undefined) {
            tags.push(`@default ${schema.default}`);
            delete schema.default;
        }
        return schema;
    };
    OpenApiConstraintShifter.shiftString = (schema) => {
        const tags = [];
        if (schema.minLength !== undefined) {
            tags.push(`@minLength ${schema.minLength}`);
            delete schema.minLength;
        }
        if (schema.maxLength !== undefined) {
            tags.push(`@maxLength ${schema.maxLength}`);
            delete schema.maxLength;
        }
        if (schema.format !== undefined) {
            tags.push(`@format ${schema.format}`);
            delete schema.format;
        }
        if (schema.pattern !== undefined) {
            tags.push(`@pattern ${schema.pattern}`);
            delete schema.pattern;
        }
        if (schema.contentMediaType !== undefined) {
            tags.push(`@contentMediaType ${schema.contentMediaType}`);
            delete schema.contentMediaType;
        }
        if (schema.default !== undefined) {
            tags.push(`@default ${schema.default}`);
            delete schema.default;
        }
        schema.description = writeTagWithDescription({
            description: schema.description,
            tags,
        });
        return schema;
    };
})(OpenApiConstraintShifter || (exports.OpenApiConstraintShifter = OpenApiConstraintShifter = {}));
const writeTagWithDescription = (props) => {
    var _a;
    if (props.tags.length === 0)
        return props.description;
    return [
        ...(((_a = props.description) === null || _a === void 0 ? void 0 : _a.length) ? [props.description, "\n"] : []),
        ...props.tags,
    ].join("\n");
};
