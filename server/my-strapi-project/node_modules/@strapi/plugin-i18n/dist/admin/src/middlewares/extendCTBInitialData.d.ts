import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store/reducers';
declare const extendCTBInitialDataMiddleware: () => Middleware<object, RootState>;
export { extendCTBInitialDataMiddleware };
