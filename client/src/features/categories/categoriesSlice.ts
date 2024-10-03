import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductData } from '@/types/interfaces';

export interface CategoriesState {
  categories: ProductData[];
  loading: boolean;
  error: null | string;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

//REST API

('root/categories/category/subcategories/products');

// 'root/category' => '[men, women, children, teen]'

('.../categories/men/shirts');
('.../categories/women/');

// APP route
// root/categories/

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL + '/subcategories?populate=*'}`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      }
    );

    return response.data.data;
  }
);

export const fetchCategoriesMen = createAsyncThunk(
  'categories/fetchCategoriesMen',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL + 'men/subcategories?populate=*'}`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      }
    );

    return response.data.data;
  }
);

export const fetchCategoriesWomen = createAsyncThunk(
  'categories/fetchCategoriesMen',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL + 'women/subcategories?populate=*'}`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      }
    );

    return response.data.data;
  }
);

//TODO
/**
 * 1. in component
 *
 * all => filter
 *
 * 2. state
 *
 * categories: {men: [], women: [] }
 *
 * 3. state.categories.women = allCategories.filter(... === women);
 *
 **/

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // categories: {men: [], women: [] }
        const allCategories = action.payload;

        // 2
        // state.categories.men = allCategories.filter(...=== men);
        // state.categories.women = allCategories.filter(... === women);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

// 3
// const categoriesSlice = createSlice({
//   name: 'categories',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCategoriesMen.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCategoriesMen.fulfilled, (state, action) => {
//         state.loading = false;
//         state.categories.men = action.payload;
//       })
//       .addCase(fetchCategoriesMen.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch';
//       });
//       .addCase(fetchCategoriesMen.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCategoriesMen.fulfilled, (state, action) => {
//         state.loading = false;
//         state.categories.men = action.payload;
//       })
//       .addCase(fetchCategoriesMen.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch';
//       });
//   },
// });

export default categoriesSlice.reducer;

// //TODO
/**
 *
 * searchSlice
 *
 *  state
 *
 *
 * {
 *   searchString: string
 *
 * }
 *
 * initialstate ''
 *
 *
 *
 *
 **/
