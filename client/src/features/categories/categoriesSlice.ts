import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CategoriesState {
  categories: {
    men: CategoryData[];
    women: CategoryData[];
  };
  loading: boolean;
  error: null | string;
}

interface CategoryData {
  id: string;
  attributes: {
    title: string;
    img: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

const initialState: CategoriesState = {
  categories: { men: [], women: [] },
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL + '/categories?populate=subcategories.img'}`,
      {
        headers: {
          Authorization: `bearer ${import.meta.env.VITE_API_TOKEN}`,
        },
      }
    );

    return response.data.data;
  }
);

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
        state.categories.men = action.payload[1].attributes.subcategories.data;
        state.categories.women =
          action.payload[0].attributes.subcategories.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

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
