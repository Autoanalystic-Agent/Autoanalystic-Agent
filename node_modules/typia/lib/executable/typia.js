#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const USAGE = `Wrong command has been detected. Use like below:

  npx typia setup \\
    --manager (npm|pnpm|yarn) \\
    --project {tsconfig.json file path}

    - npx typia setup
    - npx typia setup --manager pnpm
    - npx typia setup --project tsconfig.test.json

  npx typia generate 
    --input {directory} \\
    --output {directory}

    --npx typia generate --input src/templates --output src/functional
`;
const halt = (desc) => {
    console.error(desc);
    process.exit(-1);
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Promise.resolve().then(() => __importStar(require("comment-json")));
        yield Promise.resolve().then(() => __importStar(require("inquirer")));
        yield Promise.resolve().then(() => __importStar(require("commander")));
    }
    catch (_a) {
        halt(`typia has not been installed. Run "npm i typia" before.`);
    }
    const type = process.argv[2];
    if (type === "setup") {
        const { TypiaSetupWizard } = yield Promise.resolve().then(() => __importStar(require("./TypiaSetupWizard")));
        yield TypiaSetupWizard.setup();
    }
    else if (type === "patch") {
        const { TypiaPatchWizard } = yield Promise.resolve().then(() => __importStar(require("./TypiaPatchWizard")));
        yield TypiaPatchWizard.main();
    }
    else if (type === "generate") {
        try {
            yield Promise.resolve().then(() => __importStar(require("typescript")));
        }
        catch (_b) {
            halt(`typescript has not been installed. Run "npm i -D typescript" before.`);
        }
        const { TypiaGenerateWizard } = yield Promise.resolve().then(() => __importStar(require("./TypiaGenerateWizard")));
        yield TypiaGenerateWizard.generate();
    }
    else
        halt(USAGE);
});
main().catch((exp) => {
    console.error(exp);
    process.exit(-1);
});
//# sourceMappingURL=typia.js.map