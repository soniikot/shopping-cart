import { createSlice } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
  price: number[];
  color: string;
  size: string;
  gender: string;
}
const initialState: FilterState = {
  category: '',
  gender: '',
  price: [0, 200],
  color: '',
  size: '',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    setPriceRange(state, action) {
      state.price = action.payload;
    },
    setColor(state, action) {
      state.color = action.payload;
    },
    setSizes(state, action) {
      state.size = action.payload;
    },
    setGender(state, action) {
      state.gender = action.payload;
    },
    resetFilter(state) {
      state.category = initialState.category;
      state.price = initialState.price;
      state.color = initialState.color;
      state.size = initialState.size;
      state.gender = initialState.gender;
    },
  },
});

export const {
  setCategory,
  setPriceRange,
  setColor,
  setSizes,
  setGender,
  resetFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
