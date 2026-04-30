import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  actionLoading: false,
  receives: [],
  pagination: { total: 0, totalAll: 0, page: 1, limit: 20 },
};

export const fetchReceives = createAsyncThunk(
  "receives/fetchReceives",
  async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/purchase", {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch purchases"
      );
    }
  }
);

export const addReceive = createAsyncThunk(
  "receives/addReceive",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/purchase", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add purchase"
      );
    }
  }
);

export const deleteReceive = createAsyncThunk(
  "receives/deleteReceive",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/purchase/${id}`);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete purchase"
      );
    }
  }
);

export const updateReceive = createAsyncThunk(
  "receives/updateReceive",
  async ({ id, receiveData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/api/purchase/${id}`,
        receiveData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update purchase"
      );
    }
  }
);

const receiveSlice = createSlice({
  name: "receives",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceives.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReceives.fulfilled, (state, action) => {
        state.isLoading = false;
        state.receives = action.payload.data || [];
        state.pagination = action.payload.meta || state.pagination;
      })
      .addCase(fetchReceives.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addReceive.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addReceive.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(addReceive.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateReceive.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateReceive.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateReceive.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteReceive.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteReceive.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteReceive.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export default receiveSlice.reducer;
