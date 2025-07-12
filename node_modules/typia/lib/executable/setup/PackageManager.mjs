import fs from 'fs';
import path from 'path';
import { CommandExecutor } from './CommandExecutor.mjs';
import { FileRetriever } from './FileRetriever.mjs';

class PackageManager {
    directory;
    data;
    manager = "npm";
    get file() {
        return path.join(this.directory, "package.json");
    }
    static async mount() {
        const location = await FileRetriever.directory({
            file: "package.json",
            location: process.cwd(),
        });
        if (location === null)
            throw new URIError(`Unable to find "package.json" file`);
        return new PackageManager(location, await this.load(path.join(location, "package.json")));
    }
    async save(modifier) {
        const content = await fs.promises.readFile(this.file, "utf8");
        this.data = JSON.parse(content);
        modifier(this.data);
        return fs.promises.writeFile(this.file, JSON.stringify(this.data, null, 2), "utf8");
    }
    install(props) {
        const middle = [
            installCmdTable[this.manager],
            props.dev ? devOptionTable[this.manager] : "",
        ]
            .filter((str) => !!str.length)
            .join(" ");
        const modulo = `${props.modulo}${props.version ? `@${props.version}` : ""}`;
        CommandExecutor.run([this.manager, middle, modulo].join(" "));
        return true;
    }
    constructor(directory, data) {
        this.directory = directory;
        this.data = data;
    }
    static async load(file) {
        const content = await fs.promises.readFile(file, "utf8");
        return JSON.parse(content);
    }
}
const installCmdTable = {
    npm: "i",
    pnpm: "add",
    yarn: "add",
    bun: "add",
};
const devOptionTable = {
    npm: "-D",
    pnpm: "-D",
    yarn: "-D",
    bun: "-d",
};

export { PackageManager };
//# sourceMappingURL=PackageManager.mjs.map
