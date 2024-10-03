import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductData } from '@/types/interfaces';

export interface ProductsState {
  products: ProductData[];
  //filteredProducts: ProductData[];
  loading: boolean;
  error: null | string;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL + '/products?populate=*'}`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      }
    );

    return response.data.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
    /*
      .addMatcher(
        (action) => action.type === 'search/setSearch',
        (state, action) => {
          const searchQuery = action.payload // string
          state.filteredProduct = () => {

            return state.pruducts.filter((product) => product.attr.title === searchQuery)
          }
        } 
    ),
      
      */
  },
});

export default productsSlice.reducer;
