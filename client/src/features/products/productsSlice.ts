import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductData } from '@/types/interfaces';
import { RootState } from '@/app/store';
import { createAppSelector } from '@/app/selectors';

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
      });
  },
});

const filterCategoryType = (filterCategory: string, product: Product) => {
  return (
    product.attributes.subcategories.data[0]?.attributes.title ===
    filterCategory
  );
};

const filterColorType = (filterColor: string, product: Product) => {
  return product.attributes.color === filterColor.toLowerCase();
};

const filterSizeType = (filterSize: string[], product: Product) => {
  return product.attributes.size.includes(filterSize);
};

const filterSearch = (searchQuery: string, product: Product) => {
  return product.attributes.title
    .toLowerCase()
    .includes(searchQuery.trim().toLowerCase());
};
export const selectProducts = createAppSelector(
  (state: RootState) => state.search.searchQuery,
  (state: RootState) => state.filter.category,
  (state: RootState) => state.filter.color,
  (state: RootState) => state.filter.size,
  (state: RootState) => state.products.products,
  (searchQuery, filterCategory, filterColor, filterSize, products) => {
    let filteredProducts = products;

    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        filterSearch(searchQuery, product)
      );
    }

    if (filterCategory) {
      filteredProducts = filteredProducts.filter((product) =>
        filterCategoryType(filterCategory, product)
      );
    }

    if (filterColor) {
      filteredProducts = filteredProducts.filter((product) =>
        filterColorType(filterColor, product)
      );
    }

    if (filterSize && filterSize.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filterSizeType(filterSize, product)
      );
    }

    return filteredProducts;
  }
);

export default productsSlice.reducer;
