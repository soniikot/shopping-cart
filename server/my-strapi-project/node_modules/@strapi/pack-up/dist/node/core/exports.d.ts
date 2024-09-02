import { Logger } from './logger';
import { PackageJson } from './pkg';
/**
 * @description validate the `exports` property of the package.json against a set of rules.
 * If the validation fails, the process will throw with an appropriate error message. If
 * there is no `exports` property we check the standard export-like properties on the root
 * of the package.json.
 */
declare const validateExportsOrdering: ({ pkg, logger, }: {
    pkg: PackageJson;
    logger: Logger;
}) => Promise<PackageJson>;
type Extensions = 'cjs' | 'es';
interface ExtMap {
    commonjs: Record<Extensions, string>;
    module: Record<Extensions, string>;
}
/**
 * We potentially might need to support legacy exports or as package
 * development continues we have space to tweak this.
 */
declare const getExportExtensionMap: () => ExtMap;
interface Export {
    types?: string;
    source: string;
    browser?: {
        source: string;
        import?: string;
        require?: string;
    };
    node?: {
        source?: string;
        module?: string;
        import?: string;
        require?: string;
    };
    module?: string;
    import?: string;
    require?: string;
    default: string;
}
/**
 * @description parse the exports map from the package.json into a standardised
 * format that we can use to generate build tasks from.
 */
declare const parseExports: ({ extMap, pkg }: {
    extMap: ExtMap;
    pkg: PackageJson;
}) => (Export & {
    _path: string;
})[];
export { validateExportsOrdering, getExportExtensionMap, parseExports };
export type { ExtMap, Export, Extensions };
//# sourceMappingURL=exports.d.ts.map