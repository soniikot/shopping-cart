import { SerializedError } from '@reduxjs/toolkit';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { ApiError } from '@strapi/helper-plugin';
import { type AxiosRequestConfig } from 'axios';
export interface QueryArguments {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    config?: AxiosRequestConfig;
}
export interface UnknownApiError {
    name: 'UnknownError';
    message: string;
    details?: unknown;
    status?: number;
}
export type BaseQueryError = ApiError | UnknownApiError;
declare const axiosBaseQuery: () => BaseQueryFn<string | QueryArguments, unknown, BaseQueryError>;
declare const isBaseQueryError: (error: BaseQueryError | SerializedError) => error is BaseQueryError;
export { axiosBaseQuery, isBaseQueryError };
