/**
 * Server restart watcher
 * Sends an HEAD method to check if the server has been shut down correctly
 * and then pings until it's back on
 */
export declare function serverRestartWatcher(response: any, didShutDownServer?: boolean): Promise<unknown>;
