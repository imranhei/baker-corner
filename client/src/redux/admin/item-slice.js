import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  actionLoading: false,
  items: [],
  pagination: { total: 0, totalAll: 0, page: 1, limit: 10 },
};

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/item", {
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

export const addItem = createAsyncThunk(
  "items/addItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/item", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/item/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      // Only send necessary fields
      const payload = {
        name: itemData.name,
        category: itemData.category, // this should be the ID
        date: itemData.date,
      };

      const { data } = await axiosInstance.put(`/api/item/${id}`, payload);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.actionLoading = false;
      })
      .addCase(addItem.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.actionLoading = false;
      })
      .addCase(deleteItem.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.actionLoading = false;
      })
      .addCase(updateItem.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export default itemSlice.reducer;
