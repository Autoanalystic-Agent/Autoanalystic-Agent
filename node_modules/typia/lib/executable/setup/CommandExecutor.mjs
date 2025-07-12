import cp from 'child_process';

var CommandExecutor;
(function (CommandExecutor) {
    CommandExecutor.run = (str) => {
        console.log(`\n$ ${str}`);
        cp.execSync(str, { stdio: "inherit" });
    };
})(CommandExecutor || (CommandExecutor = {}));

export { CommandExecutor };
//# sourceMappingURL=CommandExecutor.mjs.map
