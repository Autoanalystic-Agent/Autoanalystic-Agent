import RandExp from 'randexp';

const _randomPattern = (regex) => {
    const r = new RandExp(regex);
    for (let i = 0; i < 10; ++i) {
        const str = r.gen();
        if (regex.test(str))
            return str;
    }
    return r.gen();
};

export { _randomPattern };
//# sourceMappingURL=_randomPattern.mjs.map
