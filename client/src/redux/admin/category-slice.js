import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  actionLoading: false,
  categories: [],
  pagination: { total: 0, totalAll: 0, page: 1, limit: 20 },
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/category", {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/category", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/category/${id}`,
        categoryData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addCategory.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.categories.push(action.payload.data);
        state.pagination.total += 1;
        state.pagination.totalAll += 1;
      })
      .addCase(addCategory.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload.data._id
        );
        state.pagination.total -= 1;
        state.pagination.totalAll -= 1;
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateCategory.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.categories = state.categories.map((category) => {
          if (category._id === action.payload.data._id) {
            return action.payload.data;
          }
          return category;
        });
      })
      .addCase(updateCategory.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export default categorySlice.reducer;
