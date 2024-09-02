import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store/reducers';
declare const addCommonFieldsToInitialDataMiddleware: () => Middleware<object, RootState>;
export { addCommonFieldsToInitialDataMiddleware };
