import type { ViteBaseTask } from './types';
import type { BuildContext } from '../../createBuildContext';
/**
 * @internal
 */
declare const resolveViteConfig: (ctx: BuildContext, task: ViteBaseTask) => Promise<{
    configFile: false;
    root: string;
    mode: string;
    logLevel: "warn";
    clearScreen: false;
    customLogger: import("vite").Logger;
    build: {
        minify: boolean;
        sourcemap: boolean;
        /**
         * The task runner will clear this for us
         */
        emptyOutDir: false;
        target: string[];
        outDir: string;
        lib: {
            entry: string[];
            formats: import("../../core/exports").Extensions[];
            /**
             * this enforces the file name to match what the output we've
             * determined from the package.json exports. However, when preserving modules
             * we want to let Rollup handle the file names.
             */
            fileName: (() => string) | undefined;
        };
        rollupOptions: {
            external(id: string, importer: string | undefined): boolean;
            output: {
                preserveModules: boolean;
                /**
                 * Mimic TypeScript's behavior, by setting the value to "auto" to control
                 * how Rollup handles default, namespace and dynamic imports from external
                 * dependencies in formats like CommonJS that do not natively support
                 * these concepts. Mainly styled-components@5
                 *
                 * For more info see https://rollupjs.org/configuration-options/#output-interop
                 */
                interop: "auto";
                chunkFileNames(): string;
            };
        };
    };
    plugins: import("vite").PluginOption[];
}>;
export { resolveViteConfig };
//# sourceMappingURL=config.d.ts.map