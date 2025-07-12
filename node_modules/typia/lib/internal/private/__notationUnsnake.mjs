const __notationUnsnake = (props) => (str) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let prefix = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "_")
            prefix += "_";
        else
            break;
    }
    if (prefix.length !== 0)
        str = str.substring(prefix.length);
    const out = (s) => `${prefix}${s}`;
    if (str.length === 0)
        return out("");
    const items = str.split("_").filter((s) => s.length !== 0);
    return items.length === 0
        ? out("")
        : items.length === 1
            ? out(props.plain(items[0]))
            : out(items.map(props.snake).join(""));
};

export { __notationUnsnake };
//# sourceMappingURL=__notationUnsnake.mjs.map
