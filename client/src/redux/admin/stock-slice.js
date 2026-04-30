import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  actionLoading: false,
  stocks: [],
  stock: {},
  pagination: { total: 0, totalAll: 0, page: 1, limit: 20 },
};

export const fetchStocks = createAsyncThunk(
  "stocks/fetchStocks",
  async (
    { page = 1, limit = 20, q = "", minQty, maxQty, sort } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = { page, limit, q, sort };
      if (minQty) params.minQty = minQty;
      if (maxQty) params.maxQty = maxQty;
      const response = await axiosInstance.get("/api/stock", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const fetchStockById = createAsyncThunk(
  "stocks/fetchStockById",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stock/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stocks = action.payload.data || [];
        state.pagination = action.payload.meta;
      })
      .addCase(fetchStocks.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchStockById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStockById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stock = action.payload.data;
      })
      .addCase(fetchStockById.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default stockSlice.reducer;
