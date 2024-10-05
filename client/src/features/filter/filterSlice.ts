import { createSlice } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
}
const initialState: FilterState = {
  category: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
  },
});

export const { setCategory } = filterSlice.actions;

export default filterSlice.reducer;
