import ts from 'typescript';
import { FileTransformer } from './transformers/FileTransformer.mjs';

const transform = (program, options, extras) => {
    const compilerOptions = program.getCompilerOptions();
    const strict = compilerOptions.strictNullChecks !== undefined
        ? !!compilerOptions.strictNullChecks
        : !!compilerOptions.strict;
    if (strict === false)
        extras.addDiagnostic({
            category: ts.DiagnosticCategory.Error,
            code: "(typia)",
            file: undefined,
            start: undefined,
            length: undefined,
            messageText: "strict mode is required.",
        });
    return FileTransformer.transform({
        program,
        compilerOptions,
        checker: program.getTypeChecker(),
        printer: ts.createPrinter(),
        options: options ?? {},
        extras,
    });
};

export { transform as default, transform };
//# sourceMappingURL=transform.mjs.map
