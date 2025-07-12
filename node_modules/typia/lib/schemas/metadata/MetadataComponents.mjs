import { Writable } from '../../typings/Writable.mjs';
import { Metadata } from './Metadata.mjs';
import { MetadataAliasType } from './MetadataAliasType.mjs';
import { MetadataArrayType } from './MetadataArrayType.mjs';
import { MetadataObjectType } from './MetadataObjectType.mjs';
import { MetadataProperty } from './MetadataProperty.mjs';
import { MetadataTupleType } from './MetadataTupleType.mjs';

class MetadataComponents {
    aliases;
    objects;
    arrays;
    tuples;
    dictionary;
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
                MetadataObjectType._From_without_properties(obj),
            ])),
            aliases: new Map(json.aliases.map((alias) => [
                alias.name,
                MetadataAliasType._From_without_value(alias),
            ])),
            arrays: new Map(json.arrays.map((arr) => [
                arr.name,
                MetadataArrayType._From_without_value(arr),
            ])),
            tuples: new Map(json.tuples.map((tpl) => [
                tpl.name,
                MetadataTupleType._From_without_elements(tpl),
            ])),
        };
        // CONSTRUCT METADATA OF THEM
        for (const obj of json.objects)
            dictionary.objects
                .get(obj.name)
                .properties.push(...obj.properties.map((prop) => MetadataProperty.from(prop, dictionary)));
        for (const alias of json.aliases)
            Writable(dictionary.aliases.get(alias.name)).value = Metadata.from(alias.value, dictionary);
        for (const array of json.arrays)
            Writable(dictionary.arrays.get(array.name)).value = Metadata.from(array.value, dictionary);
        for (const tuple of json.tuples)
            Writable(dictionary.tuples.get(tuple.name)).elements =
                tuple.elements.map((elem) => Metadata.from(elem, dictionary));
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

export { MetadataComponents };
//# sourceMappingURL=MetadataComponents.mjs.map
