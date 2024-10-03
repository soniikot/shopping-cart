import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import categoryReducer from '../features/categories/categoriesSlice';
import searchReducer from '../features/Search/SearchSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
