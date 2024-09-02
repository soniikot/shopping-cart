/**
 * This is typically used in circumstances where there are re-orderable pieces e.g. Dynamic Zones
 * or Repeatable fields. It finds the _original_ location of the initial data using `__temp_key__` values
 * which are added to the fields in the `INIT_FORM` reducer to give array data a stable (when you add
 * a new item they wont have a server ID).
 */
export declare const getInitialDataPathUsingTempKeys: (initialData: Record<string, any>, modifiedData: Record<string, any>) => (currentPath: string) => string[];
