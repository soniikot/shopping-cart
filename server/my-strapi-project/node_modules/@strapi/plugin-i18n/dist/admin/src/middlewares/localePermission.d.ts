import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store/reducers';
/**
 * TODO: is it possible to get the action types? How do we do it
 * when actions are spread across multiple packages e.g. content-manager
 * or content-type-builder?
 */
declare const localePermissionMiddleware: () => Middleware<object, RootState>;
export { localePermissionMiddleware };
