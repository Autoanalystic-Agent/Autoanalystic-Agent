"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypiaGenerateWizard = void 0;
const fs_1 = __importDefault(require("fs"));
const TypiaProgrammer_1 = require("../programmers/TypiaProgrammer");
const ArgumentParser_1 = require("./setup/ArgumentParser");
const PackageManager_1 = require("./setup/PackageManager");
var TypiaGenerateWizard;
(function (TypiaGenerateWizard) {
    function generate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("----------------------------------------");
            console.log(" Typia Generate Wizard");
            console.log("----------------------------------------");
            // LOAD PACKAGE.JSON INFO
            const pack = yield PackageManager_1.PackageManager.mount();
            const options = yield ArgumentParser_1.ArgumentParser.parse(pack, inquiry);
            yield TypiaProgrammer_1.TypiaProgrammer.build(options);
        });
    }
    TypiaGenerateWizard.generate = generate;
    const inquiry = (_pack, command, prompt, action) => __awaiter(this, void 0, void 0, function* () {
        // PREPARE ASSETS
        command.option("--input [path]", "input directory");
        command.option("--output [directory]", "output directory");
        command.option("--project [project]", "tsconfig.json file location");
        const questioned = { value: false };
        const input = (name) => (message) => __awaiter(this, void 0, void 0, function* () {
            const result = yield prompt()({
                type: "input",
                name,
                message,
                default: "",
            });
            return result[name];
        });
        const select = (name) => (message) => (choices) => __awaiter(this, void 0, void 0, function* () {
            questioned.value = true;
            return (yield prompt()({
                type: "list",
                name: name,
                message: message,
                choices: choices,
            }))[name];
        });
        const configure = () => __awaiter(this, void 0, void 0, function* () {
            const files = yield (yield fs_1.default.promises.readdir(process.cwd())).filter((str) => str.substring(0, 8) === "tsconfig" &&
                str.substring(str.length - 5) === ".json");
            if (files.length === 0)
                throw new URIError(`Unable to find "tsconfig.json" file.`);
            else if (files.length === 1)
                return files[0];
            return select("tsconfig")("TS Config File")(files);
        });
        return action((options) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            (_a = options.input) !== null && _a !== void 0 ? _a : (options.input = yield input("input")("input directory"));
            (_b = options.output) !== null && _b !== void 0 ? _b : (options.output = yield input("output")("output directory"));
            (_c = options.project) !== null && _c !== void 0 ? _c : (options.project = yield configure());
            return options;
        }));
    });
})(TypiaGenerateWizard || (exports.TypiaGenerateWizard = TypiaGenerateWizard = {}));
//# sourceMappingURL=TypiaGenerateWizard.js.map