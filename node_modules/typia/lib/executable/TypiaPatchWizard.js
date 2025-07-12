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
exports.TypiaPatchWizard = void 0;
const fs_1 = __importDefault(require("fs"));
var TypiaPatchWizard;
(function (TypiaPatchWizard) {
    TypiaPatchWizard.main = () => __awaiter(this, void 0, void 0, function* () {
        console.log("----------------------------------------");
        console.log(" Typia Setup Wizard");
        console.log("----------------------------------------");
        console.log([
            `Since TypeScript v5.3 update, "tsc" no more parses JSDoc comments.`,
            ``,
            `Therefore, "typia" revives the JSDoc parsing feature by patching "tsc".`,
            ``,
            `This is a temporary feature of "typia", and it would be removed when "ts-patch" being updated.`,
        ].join("\n"));
        yield TypiaPatchWizard.patch();
    });
    TypiaPatchWizard.patch = () => __awaiter(this, void 0, void 0, function* () {
        for (const file of ["tsc.js", "_tsc.js"])
            try {
                const location = require.resolve(`typescript/lib/${file}`);
                const content = yield fs_1.default.promises.readFile(location, "utf8");
                if (content.indexOf(FROM_WITH_COMMENT) !== -1)
                    yield fs_1.default.promises.writeFile(location, content.replace(FROM_WITH_COMMENT, TO_WITH_COMMENT), "utf8");
                else if (content.indexOf(FROM_ONLY) !== -1)
                    yield fs_1.default.promises.writeFile(location, content.replace(FROM_ONLY, TO_ONLY), "utf8");
            }
            catch (_a) { }
    });
})(TypiaPatchWizard || (exports.TypiaPatchWizard = TypiaPatchWizard = {}));
const FROM_WITH_COMMENT = `var defaultJSDocParsingMode = 2 /* ParseForTypeErrors */`;
const TO_WITH_COMMENT = `var defaultJSDocParsingMode = 0 /* ParseAll */`;
const FROM_ONLY = `var defaultJSDocParsingMode = 2`;
const TO_ONLY = `var defaultJSDocParsingMode = 0`;
//# sourceMappingURL=TypiaPatchWizard.js.map