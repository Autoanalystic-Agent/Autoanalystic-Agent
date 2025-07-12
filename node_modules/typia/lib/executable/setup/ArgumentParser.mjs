import commander from 'commander';
import inquirer from 'inquirer';

var ArgumentParser;
(function (ArgumentParser) {
    ArgumentParser.parse = async (pack, inquiry) => {
        // TAKE OPTIONS
        const action = (closure) => new Promise((resolve, reject) => {
            commander.program.action(async (options) => {
                try {
                    resolve(await closure(options));
                }
                catch (exp) {
                    reject(exp);
                }
            });
            commander.program.parseAsync().catch(reject);
        });
        return inquiry(pack, commander.program, inquirer.createPromptModule, action);
    };
})(ArgumentParser || (ArgumentParser = {}));

export { ArgumentParser };
//# sourceMappingURL=ArgumentParser.mjs.map
