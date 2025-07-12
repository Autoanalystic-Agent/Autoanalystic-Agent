var StringUtil;
(function (StringUtil) {
    StringUtil.capitalize = (str) => str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
    StringUtil.escapeDuplicate = (props) => props.keep.includes(props.input)
        ? StringUtil.escapeDuplicate({
            keep: props.keep,
            input: (props.escape ?? ((str) => `_${str}`))(props.input),
        })
        : props.input;
})(StringUtil || (StringUtil = {}));

export { StringUtil };
//# sourceMappingURL=StringUtil.mjs.map
