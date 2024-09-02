import ts from 'typescript';
import { Logger } from '../../core/logger';
declare const printDiagnostic: (diagnostic: ts.Diagnostic, { logger, cwd }: {
    logger: Logger;
    cwd: string;
}) => void;
export { printDiagnostic };
//# sourceMappingURL=diagnostic.d.ts.map