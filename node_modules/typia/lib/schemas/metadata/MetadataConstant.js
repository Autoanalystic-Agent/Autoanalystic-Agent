"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataConstant = void 0;
const MetadataConstantValue_1 = require("./MetadataConstantValue");
class MetadataConstant {
    constructor(props) {
        this.type = props.type;
        this.values = props.values.map(MetadataConstantValue_1.MetadataConstantValue.create);
    }
    static create(props) {
        return new MetadataConstant(props);
    }
    static from(json) {
        return MetadataConstant.create({
            type: json.type,
            values: json.values.map(MetadataConstantValue_1.MetadataConstantValue.from),
        });
    }
    toJSON() {
        return {
            type: this.type,
            values: this.values.map((value) => value.toJSON()),
        };
    }
}
exports.MetadataConstant = MetadataConstant;
//# sourceMappingURL=MetadataConstant.js.map