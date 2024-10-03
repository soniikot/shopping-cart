import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import categoryReducer from '../features/categories/categoriesSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
