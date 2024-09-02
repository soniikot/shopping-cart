import { Dispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook } from 'react-redux';
import { Action, RootState } from './reducers';
type AppDispatch = Dispatch<Action>;
declare const useTypedDispatch: () => AppDispatch;
declare const useTypedSelector: TypedUseSelectorHook<RootState>;
export { useTypedSelector, useTypedDispatch };
