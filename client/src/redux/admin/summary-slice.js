import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

export const fetchSummary = createAsyncThunk(
  "summary/fetchSummary",

  async ({ month, year, category = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/summary", {
        params: {
          month,
          year,
          category,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const initialState = {
  cards: {
    totalRevenue: 0,
    totalQuantitySold: 0,
    totalTransactions: 0,
    totalProfit: 0,
  },
  revenueChart: [],
  categoryChart: [],
  topItems: [],
  loading: false,
  error: null,
};

const summarySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload.cards;
        state.revenueChart = action.payload.revenueChart;
        state.categoryChart = action.payload.categoryChart;
        state.topItems = action.payload.topItems;
      })

      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load summary";
      });
  },
});

export default summarySlice.reducer;
