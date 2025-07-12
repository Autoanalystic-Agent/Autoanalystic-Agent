"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataComponents = void 0;
const Writable_1 = require("../../typings/Writable");
const Metadata_1 = require("./Metadata");
const MetadataAliasType_1 = require("./MetadataAliasType");
const MetadataArrayType_1 = require("./MetadataArrayType");
const MetadataObjectType_1 = require("./MetadataObjectType");
const MetadataProperty_1 = require("./MetadataProperty");
const MetadataTupleType_1 = require("./MetadataTupleType");
class MetadataComponents {
    constructor(props) {
        this.aliases = props.aliases;
        this.objects = props.objects;
        this.arrays = props.arrays;
        this.tuples = props.tuples;
        this.dictionary = props.dictionary;
    }
    static from(json) {
        // INITIALIZE COMPONENTS
        const dictionary = {
            objects: new Map(json.objects.map((obj) => [
                obj.name,
                MetadataObjectType_1.MetadataObjectType._From_without_properties(obj),
            ])),
            aliases: new Map(json.aliases.map((alias) => [
                alias.name,
                MetadataAliasType_1.MetadataAliasType._From_without_value(alias),
            ])),
            arrays: new Map(json.arrays.map((arr) => [
                arr.name,
                MetadataArrayType_1.MetadataArrayType._From_without_value(arr),
            ])),
            tuples: new Map(json.tuples.map((tpl) => [
                tpl.name,
                MetadataTupleType_1.MetadataTupleType._From_without_elements(tpl),
            ])),
        };
        // CONSTRUCT METADATA OF THEM
        for (const obj of json.objects)
            dictionary.objects
                .get(obj.name)
                .properties.push(...obj.properties.map((prop) => MetadataProperty_1.MetadataProperty.from(prop, dictionary)));
        for (const alias of json.aliases)
            (0, Writable_1.Writable)(dictionary.aliases.get(alias.name)).value = Metadata_1.Metadata.from(alias.value, dictionary);
        for (const array of json.arrays)
            (0, Writable_1.Writable)(dictionary.arrays.get(array.name)).value = Metadata_1.Metadata.from(array.value, dictionary);
        for (const tuple of json.tuples)
            (0, Writable_1.Writable)(dictionary.tuples.get(tuple.name)).elements =
                tuple.elements.map((elem) => Metadata_1.Metadata.from(elem, dictionary));
        // FINALIZE
        return new MetadataComponents({
            aliases: [...dictionary.aliases.values()],
            objects: [...dictionary.objects.values()],
            arrays: [...dictionary.arrays.values()],
            tuples: [...dictionary.tuples.values()],
            dictionary,
        });
    }
    toJSON() {
        return {
            aliases: this.aliases.map((alias) => alias.toJSON()),
            objects: this.objects.map((object) => object.toJSON()),
            arrays: this.arrays.map((array) => array.toJSON()),
            tuples: this.tuples.map((tuple) => tuple.toJSON()),
        };
    }
}
exports.MetadataComponents = MetadataComponents;
//# sourceMappingURL=MetadataComponents.js.map