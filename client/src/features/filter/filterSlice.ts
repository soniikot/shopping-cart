import { createSlice } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
  price: number[];
  color: string;
  size: string;
}
const initialState: FilterState = {
  category: '',
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
    resetFilter(state) {
      state.category = initialState.category;
      state.price = initialState.price;
      state.color = initialState.color;
      state.size = initialState.size;
    },
  },
});

export const { setCategory, setPriceRange, setColor, setSizes, resetFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
