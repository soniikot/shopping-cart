interface Query {
    plugins?: Record<string, unknown>;
    _q?: string;
    [key: string]: any;
}
/**
 * @description
 * Creates a valid query params object for get requests
 * ie. plugins[18n][locale]=en becomes locale=en
 */
declare const buildValidGetParams: (query?: Query) => {
    [x: string]: any;
};
export { buildValidGetParams };
