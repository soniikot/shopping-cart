interface LoggerOptions {
    silent?: boolean;
    debug?: boolean;
}
export interface Logger {
    warnings: number;
    errors: number;
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    log: (...args: any[]) => void;
    success: (...args: any[]) => void;
}
export declare const createLogger: (options?: LoggerOptions) => Logger;
export {};
//# sourceMappingURL=logger.d.ts.map