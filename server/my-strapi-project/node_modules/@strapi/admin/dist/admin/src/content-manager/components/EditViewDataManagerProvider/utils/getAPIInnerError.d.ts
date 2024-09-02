import type { ApiError, TranslationMessage } from '@strapi/helper-plugin';
import type { AxiosError } from 'axios';
declare const getAPIInnerError: (error: AxiosError<{
    error: ApiError;
}, any>) => Record<string, TranslationMessage>;
export { getAPIInnerError };
