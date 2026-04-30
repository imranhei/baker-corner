import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  actionLoading: false,
  dispatches: [],
  pagination: { total: 0, totalAll: 0, page: 1, limit: 20 },
};

export const fetchDispatches = createAsyncThunk(
  "dispatches/fetchDispatches",
  async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/sale", {
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

export const addDispatch = createAsyncThunk(
  "dispatches/addDispatch",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/sale", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const deleteDispatch = createAsyncThunk(
  "dispatches/deleteDispatch",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/sale/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

export const updateDispatch = createAsyncThunk(
  "dispatches/updateDispatch",
  async ({ id, dispatchData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/sale/${id}`, dispatchData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error"
      );
    }
  }
);

const dispatchSlice = createSlice({
  name: "dispatches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispatches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDispatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dispatches = action.payload.data || [];
        state.pagination = action.payload.meta || state.pagination;
      })
      .addCase(fetchDispatches.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addDispatch.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addDispatch.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(addDispatch.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteDispatch.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteDispatch.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(deleteDispatch.rejected, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateDispatch.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateDispatch.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(updateDispatch.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export default dispatchSlice.reducer;
