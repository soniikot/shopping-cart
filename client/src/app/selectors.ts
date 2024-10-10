import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const createAppSelector = createSelector.withTypes<RootState>();
