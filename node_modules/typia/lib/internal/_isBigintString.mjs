const _isBigintString = (str) => {
    try {
        BigInt(str);
        return true;
    }
    catch {
        return false;
    }
};

export { _isBigintString };
//# sourceMappingURL=_isBigintString.mjs.map
