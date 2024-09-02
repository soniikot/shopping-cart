import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store/reducers';
declare const extendCTBAttributeInitialDataMiddleware: () => Middleware<object, RootState>;
export { extendCTBAttributeInitialDataMiddleware };
