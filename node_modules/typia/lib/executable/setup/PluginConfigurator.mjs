import comments from 'comment-json';
import fs from 'fs';

var PluginConfigurator;
(function (PluginConfigurator) {
    async function configure(args) {
        // GET COMPILER-OPTIONS
        const config = comments.parse(await fs.promises.readFile(args.project, "utf8"));
        const compilerOptions = config.compilerOptions;
        if (compilerOptions === undefined)
            throw new ReferenceError(`${args.project} file does not have "compilerOptions" property.`);
        // PREPARE PLUGINS
        const plugins = (() => {
            const plugins = compilerOptions.plugins;
            if (plugins === undefined)
                return (compilerOptions.plugins = []);
            else if (!Array.isArray(plugins))
                throw new TypeError(`"plugins" property of ${args.project} must be array type.`);
            return plugins;
        })();
        const strict = compilerOptions.strict;
        const strictNullChecks = compilerOptions.strictNullChecks;
        const skipLibCheck = compilerOptions.skipLibCheck;
        const oldbie = plugins.find((p) => typeof p === "object" &&
            p !== null &&
            p.transform === "typia/lib/transform");
        if (strictNullChecks !== false &&
            (strict === true || strictNullChecks === true) &&
            oldbie !== undefined &&
            skipLibCheck === true)
            return;
        // DO CONFIGURE
        compilerOptions.skipLibCheck = true;
        compilerOptions.strictNullChecks = true;
        if (strict === undefined && strictNullChecks === undefined)
            compilerOptions.strict = true;
        if (oldbie === undefined)
            plugins.push(comments.parse(`
                        {
                            "transform": "typia/lib/transform"
                        }`));
        await fs.promises.writeFile(args.project, comments.stringify(config, null, 2));
    }
    PluginConfigurator.configure = configure;
})(PluginConfigurator || (PluginConfigurator = {}));

export { PluginConfigurator };
//# sourceMappingURL=PluginConfigurator.mjs.map
