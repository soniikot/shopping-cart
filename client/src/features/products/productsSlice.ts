import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductData } from '@/types/interfaces';

export interface ProductsState {
  products: ProductData[];
  filteredProducts: ProductData[];
  loading: boolean;
  error: null | string;
}

const initialState: ProductsState = {
  products: [],
  filteredProducts: [],
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
      })

      .addMatcher(
        (action) => action.type === 'filter/setCategory',
        (state, action) => {
          state.filteredProducts = state.products.filter((product) => {
            const subcategories = product.attributes.subcategories.data;
            return subcategories.some(
              (subcategory) => subcategory.attributes.title === action.payload
            );
          });
        }
      )
      .addMatcher(
        (action) => action.type === 'filter/setPriceRange',
        (state, action) => {
          const [min, max] = action.payload;
          state.filteredProducts = state.products.filter((product) => {
            const price = product.attributes.price;
            return price >= min && price <= max;
          });
        }
      )

      .addMatcher(
        (action) => action.type === 'search/setSearch',
        (state, action) => {
          state.filteredProducts = state.products.filter((product) => {
            const title = product.attributes.title;
            return title.includes(action.payload);
          });
        }
      )

      .addMatcher(
        (action) => action.type === 'filter/setColor',
        (state, action) => {
          state.filteredProducts = state.products.filter((product) => {
            const color = product.attributes.color;
            return color === action.payload.toLowerCase();
          });
        }
      );
  },
});

export default productsSlice.reducer;
