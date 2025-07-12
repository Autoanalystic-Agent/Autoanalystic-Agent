import { StringUtil } from './StringUtil.mjs';

var NamingConvention;
(function (NamingConvention) {
    const unsnake = (props) => (str) => {
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
    function snake(str) {
        if (str.length === 0)
            return str;
        // PREFIX
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
        // SNAKE CASE
        const items = str.split("_");
        if (items.length > 1)
            return out(items.map((s) => s.toLowerCase()).join("_"));
        // CAMEL OR PASCAL CASE
        const indexes = [];
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (65 <= code && code <= 90)
                indexes.push(i);
        }
        for (let i = indexes.length - 1; i > 0; --i) {
            const now = indexes[i];
            const prev = indexes[i - 1];
            if (now - prev === 1)
                indexes.splice(i, 1);
        }
        if (indexes.length !== 0 && indexes[0] === 0)
            indexes.splice(0, 1);
        if (indexes.length === 0)
            return str.toLowerCase();
        let ret = "";
        for (let i = 0; i < indexes.length; i++) {
            const first = i === 0 ? 0 : indexes[i - 1];
            const last = indexes[i];
            ret += str.substring(first, last).toLowerCase();
            ret += "_";
        }
        ret += str.substring(indexes[indexes.length - 1]).toLowerCase();
        return out(ret);
    }
    NamingConvention.snake = snake;
    function camel(str) {
        return unsnake({
            plain: (str) => str.length
                ? str === str.toUpperCase()
                    ? str.toLocaleLowerCase()
                    : `${str[0].toLowerCase()}${str.substring(1)}`
                : str,
            snake: (str, i) => i === 0 ? str.toLowerCase() : StringUtil.capitalize(str.toLowerCase()),
        })(str);
    }
    NamingConvention.camel = camel;
    function pascal(str) {
        return unsnake({
            plain: (str) => str.length ? `${str[0].toUpperCase()}${str.substring(1)}` : str,
            snake: StringUtil.capitalize,
        })(str);
    }
    NamingConvention.pascal = pascal;
})(NamingConvention || (NamingConvention = {}));

export { NamingConvention };
//# sourceMappingURL=NamingConvention.mjs.map
