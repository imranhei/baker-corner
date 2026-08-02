import { getSummary } from "@/services/summary-service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSummary = createAsyncThunk(
  "summary/fetchSummary",

  async (filters) => {
    const data = await getSummary(filters);

    return data;
  },
);

const initialState = {
  loading: false,

  cards: {
    totalRevenue: 0,
    totalQuantitySold: 0,
    totalTransactions: 0,
    averageOrderValue: 0,
  },

  revenueChart: [],

  categoryChart: [],

  topItems: [],

  recentSales: [],

  pagination: {},
};

const summarySlice = createSlice({
  name: "summary",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;

        state.cards = action.payload.cards;

        state.revenueChart = action.payload.revenueChart;

        state.categoryChart = action.payload.categoryChart;

        state.topItems = action.payload.topItems;

        state.recentSales = action.payload.recentSales;

        state.pagination = action.payload.pagination;
      })

      .addCase(fetchSummary.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default summarySlice.reducer;
