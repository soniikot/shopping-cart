interface BasePaginationParams {
    withCount?: boolean | 't' | '1' | 'true' | 'f' | '0' | 'false' | 0 | 1;
}
type PagedPagination = BasePaginationParams & {
    page?: number;
    pageSize?: number;
};
type OffsetPagination = BasePaginationParams & {
    start?: number;
    limit?: number;
};
export type PaginationParams = PagedPagination | OffsetPagination;
type PaginationInfo = {
    page: number;
    pageSize: number;
} | {
    start: number;
    limit: number;
};
declare const shouldCount: (params: {
    pagination?: PaginationParams;
}) => boolean;
declare const getPaginationInfo: (params: {
    pagination?: PaginationParams;
}) => PaginationInfo;
declare const convertPagedToStartLimit: (paginationInfo: PaginationInfo) => {
    start: number;
    limit: number;
};
declare const transformPaginationResponse: (paginationInfo: PaginationInfo, count: number) => {
    pageCount: number;
    total: number;
    page: number;
    pageSize: number;
} | {
    total: number;
    start: number;
    limit: number;
};
export { getPaginationInfo, convertPagedToStartLimit, transformPaginationResponse, shouldCount };
//# sourceMappingURL=pagination.d.ts.map