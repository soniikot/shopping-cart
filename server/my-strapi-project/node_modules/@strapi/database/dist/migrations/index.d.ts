import type { Database } from '..';
export interface MigrationProvider {
    shouldRun(): Promise<boolean>;
    up(): Promise<void>;
    down(): Promise<void>;
}
/**
 * Creates migrations provider
 * @type {import('.').createMigrationsProvider}
 */
export declare const createMigrationsProvider: (db: Database) => MigrationProvider;
//# sourceMappingURL=index.d.ts.map