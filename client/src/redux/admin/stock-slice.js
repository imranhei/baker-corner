import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  isFetchingMore: false,
  actionLoading: false,

  stocks: [],
  stock: {},

  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    hasMore: false,
  },
};

export const fetchStocks = createAsyncThunk(
  "stocks/fetchStocks",
  async (
    { page = 1, limit = 20, q = "", minQty, maxQty, sort } = {},
    { rejectWithValue },
  ) => {
    try {
      const params = { page, limit, q, sort };
      if (minQty) params.minQty = minQty;
      if (maxQty) params.maxQty = maxQty;
      const response = await axiosInstance.get("/api/stock", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error",
      );
    }
  },
);

export const fetchStockById = createAsyncThunk(
  "stocks/fetchStockById",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/stock/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error",
      );
    }
  },
);

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    resetStocks: (state) => {
      state.stocks = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state, action) => {
        const page = action.meta.arg?.page || 1;

        if (page === 1) {
          state.isLoading = true;
        } else {
          state.isFetchingMore = true;
        }
      })

      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetchingMore = false;

        const { data, meta } = action.payload;

        if (meta.page === 1) {
          state.stocks = data;
        } else {
          state.stocks.push(...data);
        }

        state.pagination = {
          ...meta,
          hasMore: meta.page < meta.pages,
        };
      })

      .addCase(fetchStocks.rejected, (state) => {
        state.isLoading = false;
        state.isFetchingMore = false;
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

export const { resetStocks } = stockSlice.actions;
export default stockSlice.reducer;
