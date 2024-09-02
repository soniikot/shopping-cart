/**
 * This is the type for a parsed git config file.
 *
 * There's another object attached but for ease of
 * readability we're only interested in user information.
 */
interface GitConfig {
    user: {
        name?: string;
        email?: string;
    };
}
/**
 * @internal
 *
 * @description Parses the global git config file.
 */
declare const parseGlobalGitConfig: () => Promise<GitConfig | null>;
export { parseGlobalGitConfig };
export type { GitConfig };
//# sourceMappingURL=git.d.ts.map