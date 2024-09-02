interface PaginationArgs {
    page: number;
    pageSize: number;
    start: number;
    limit: number;
}
export interface Pagination {
    start: number;
    limit: number;
}
declare const withDefaultPagination: (args: Partial<PaginationArgs>, { defaults, maxLimit }?: {
    defaults?: {} | undefined;
    maxLimit?: number | undefined;
}) => Partial<PaginationArgs> & {
    start: number;
    limit: number;
};
export { withDefaultPagination };
//# sourceMappingURL=pagination.d.ts.map