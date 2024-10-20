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

const filterCategoryType = (filterCategory: string, product: ProductData) => {
  return (
    product.attributes.subcategories.data[0]?.attributes.title ===
    filterCategory
  );
};

const filterByGenderType = (filterGender: string, product: ProductData) => {
  return (
    product.attributes.categories.data[0]?.attributes.title === filterGender
  );
};

const filterColorType = (filterColor: string, product: ProductData) => {
  return product.attributes.color === filterColor.toLowerCase();
};

const filterSizeType = (filterSize: string, product: ProductData) => {
  return product.attributes.size.includes(filterSize);
};

const filterSearch = (searchQuery: string, product: ProductData) => {
  return product.attributes.title
    .toLowerCase()
    .includes(searchQuery.trim().toLowerCase());
};

const filterPriceType = (filterPrice: number[], product: ProductData) => {
  return (
    product.attributes.price >= filterPrice[0] &&
    product.attributes.price <= filterPrice[1]
  );
};

export const selectProducts = createAppSelector(
  (state: RootState) => state.search.searchQuery,
  (state: RootState) => state.filter.category,
  (state: RootState) => state.filter.color,
  (state: RootState) => state.filter.size,
  (state: RootState) => state.filter.price,
  (state: RootState) => state.filter.gender,
  (state: RootState) => state.products.products,
  (
    searchQuery,
    filterCategory,
    filterColor,
    filterSize,
    filterPrice,
    filterGender,
    products
  ) => {
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

    if (filterGender) {
      filteredProducts = filteredProducts.filter((product) =>
        filterByGenderType(filterGender, product)
      );
    }

    if (filterColor) {
      filteredProducts = filteredProducts.filter((product) =>
        filterColorType(filterColor, product)
      );
    }

    if (filterSize) {
      filteredProducts = filteredProducts.filter((product) =>
        filterSizeType(filterSize, product)
      );
    }

    if (filterPrice) {
      filteredProducts = filteredProducts.filter((product) =>
        filterPriceType(filterPrice, product)
      );
    }

    return filteredProducts;
  }
);

export default productsSlice.reducer;
