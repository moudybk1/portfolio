import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

// Run the actual server modules with the existing TypeScript dependency.
// Each loader has its own cache, so fault-injection tests cannot affect the app.
export function createLoader(overrides = {}) {
  const modules = new Map();
  return function load(filename) {
    filename = path.resolve(filename);
    if (modules.has(filename)) return modules.get(filename).exports;
    const compiledModule = { exports: {} };
    modules.set(filename, compiledModule);
    const requireFromFile = createRequire(filename);
    const localRequire = (specifier) => {
      if (Object.hasOwn(overrides, specifier)) return overrides[specifier];
      if (specifier.startsWith(".")) {
        const local = path.resolve(path.dirname(filename), `${specifier}.ts`);
        if (fs.existsSync(local)) return load(local);
      }
      return requireFromFile(specifier);
    };
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    });
    vm.compileFunction(
      outputText,
      ["exports", "require", "module", "__filename", "__dirname"],
      { filename },
    )(compiledModule.exports, localRequire, compiledModule, filename, path.dirname(filename));
    return compiledModule.exports;
  };
}
