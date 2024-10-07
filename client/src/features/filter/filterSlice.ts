import { createSlice } from '@reduxjs/toolkit';

interface FilterState {
  category: string;
  price: number[];
  color: string;
}
const initialState: FilterState = {
  category: '',
  price: [0, 200],
  color: '',
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
  },
});

export const { setCategory, setPriceRange, setColor } = filterSlice.actions;

export default filterSlice.reducer;
