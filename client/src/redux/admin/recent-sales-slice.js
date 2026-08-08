import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export const fetchRecentSales = createAsyncThunk(
  "recentSales/fetchRecentSales",

  async (
    { month, year, category = "", page = 1, limit = 10 },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.get("/api/summary/recent-sales", {
        params: {
          month,
          year,
          category,
          page,
          limit,
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  recentSales: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const recentSalesSlice = createSlice({
  name: "recentSales",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchRecentSales.fulfilled, (state, action) => {
        state.loading = false;
        state.recentSales = action.payload.recentSales;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchRecentSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load sales";
      });
  },
});

export default recentSalesSlice.reducer;
