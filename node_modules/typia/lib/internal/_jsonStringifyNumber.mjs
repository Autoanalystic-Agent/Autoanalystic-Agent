import { TypeGuardError } from '../TypeGuardError.mjs';

const _jsonStringifyNumber = (value) => {
    if (isFinite(value) === false)
        throw new TypeGuardError({
            method: "typia.json.stringify",
            expected: "number",
            value,
            message: "Error on typia.json.stringify(): infinite or not a number.",
        });
    return value;
};

export { _jsonStringifyNumber };
//# sourceMappingURL=_jsonStringifyNumber.mjs.map
