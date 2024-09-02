/**
 * @internal
 */
declare const pathExists: (path: string) => Promise<boolean>;
/**
 * @internal
 *
 * @description Ensures that the path is viable for a package to be created at
 * by checking if it exists, if not creating it and if it does exist ensuring it's
 * an empty directory. It will fail if any of these conditions are not met.
 */
declare const ensurePackagePathIsViable: (path: string) => Promise<void>;
export { ensurePackagePathIsViable, pathExists };
//# sourceMappingURL=files.d.ts.map