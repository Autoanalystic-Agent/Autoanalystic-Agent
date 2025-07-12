import { TypeGuardError } from '../TypeGuardError.mjs';

const _assertGuard = (exceptionable, props, factory) => {
    if (exceptionable === true) {
        if (factory)
            throw factory(props);
        else
            throw new TypeGuardError(props);
    }
    return false;
};

export { _assertGuard };
//# sourceMappingURL=_assertGuard.mjs.map
