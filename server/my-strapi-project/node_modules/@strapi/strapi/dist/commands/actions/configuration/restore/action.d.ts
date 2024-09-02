type Strategy = 'replace' | 'merge' | 'keep';
interface CmdOptions {
    file?: string;
    strategy?: Strategy;
}
/**
 * Will restore configurations. It reads from a file or stdin
 */
declare const _default: ({ file: filePath, strategy }: CmdOptions) => Promise<never>;
export default _default;
//# sourceMappingURL=action.d.ts.map