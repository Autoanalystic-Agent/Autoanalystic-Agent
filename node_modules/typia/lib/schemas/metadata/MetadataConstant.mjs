import { MetadataConstantValue } from './MetadataConstantValue.mjs';

class MetadataConstant {
    type;
    values;
    constructor(props) {
        this.type = props.type;
        this.values = props.values.map(MetadataConstantValue.create);
    }
    static create(props) {
        return new MetadataConstant(props);
    }
    static from(json) {
        return MetadataConstant.create({
            type: json.type,
            values: json.values.map(MetadataConstantValue.from),
        });
    }
    toJSON() {
        return {
            type: this.type,
            values: this.values.map((value) => value.toJSON()),
        };
    }
}

export { MetadataConstant };
//# sourceMappingURL=MetadataConstant.mjs.map
