import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.id);

      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    increaseCount: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.id);

      if (item) {
        item.quantity += 1;
      }
    },
    decreaseCount: (state, action) => {
      const item = state.cart.find((item) => item.id === action.payload.id);

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cart = state.cart.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
    },
    removeItem: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },
    resetCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  increaseCount,
  decreaseCount,
  removeItem,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
