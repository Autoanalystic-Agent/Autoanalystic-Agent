import { Metadata } from '../../schemas/metadata/Metadata.mjs';
import { ArrayUtil } from '../../utils/ArrayUtil.mjs';
import { MapUtil } from '../../utils/MapUtil.mjs';

var UnionPredicator;
(function (UnionPredicator) {
    UnionPredicator.object = (objects) => {
        // PROPERTY MATRIX
        const matrix = new Map();
        for (const obj of objects)
            for (const prop of obj.properties) {
                const key = prop.key.getSoleLiteral();
                if (key !== null)
                    MapUtil.take(matrix, key, () => ArrayUtil.repeat(objects.length, () => null));
            }
        objects.forEach((obj, i) => {
            for (const prop of obj.properties) {
                const key = prop.key.getSoleLiteral();
                if (key !== null)
                    matrix.get(key)[i] = prop;
            }
        });
        // EXPLORE SPECIALIZERS
        const output = [];
        objects.forEach((obj, i) => {
            const children = [];
            obj.properties.forEach((prop) => {
                // MUST BE REQUIRED
                if (prop.value.isRequired() === false)
                    return;
                const key = prop.key.getSoleLiteral();
                if (key === null)
                    return;
                // FIND NEIGHBORHOOD PROPERTIES
                const neighbors = matrix
                    .get(key)
                    .filter((oppo, k) => i !== k && oppo !== null);
                // NO NEIGHBORHOOD
                const unique = neighbors.length === 0 ||
                    neighbors.every((n) => !Metadata.intersects(prop.value, n.value));
                if (unique === true)
                    children.push({
                        property: prop,
                        neighbor: neighbors.length !== 0,
                    });
            });
            if (children.length === 0)
                return;
            const top = children.find((child) => child.property.value.isConstant()) ||
                children[0];
            output.push({
                index: i,
                object: obj,
                ...top,
            });
        });
        return output;
    };
})(UnionPredicator || (UnionPredicator = {}));

export { UnionPredicator };
//# sourceMappingURL=UnionPredicator.mjs.map
