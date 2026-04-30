import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";

const initialState = {
  isLoading: false,
  actionLoading: false,
  items: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    hasMore: true, // ✅ REQUIRED for infinite scroll
  },
};

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/item", {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error",
      );
    }
  },
);

export const addItem = createAsyncThunk(
  "items/addItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/item", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error",
      );
    }
  },
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/item/${id}`);
      return { id, ...response.data }; // ✅ return id for local update
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error",
      );
    }
  },
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const payload = {
        name: itemData.name,
        category: itemData.category,
      };

      const { data } = await axiosInstance.put(`/api/item/${id}`, payload);
      return data.data; // ✅ return updated item only
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unauthorized or server error",
      );
    }
  },
);

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    // ✅ optional reset (useful when changing filters)
    resetItems: (state) => {
      state.items = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 20,
        hasMore: true,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 FETCH ITEMS
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;

        const { data, pagination } = action.payload;

        // ✅ IMPORTANT: append for infinite scroll
        if (pagination.page === 1) {
          state.items = data;
        } else {
          state.items = [...state.items, ...data];
        }

        state.pagination = pagination;
      })
      .addCase(fetchItems.rejected, (state) => {
        state.isLoading = false;
      })

      // ➕ ADD ITEM
      .addCase(addItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.actionLoading = false;

        // ✅ optional: prepend instantly (no refetch needed)
        if (action.payload?.data) {
          state.items.unshift(action.payload.data);
        }
      })
      .addCase(addItem.rejected, (state) => {
        state.actionLoading = false;
      })

      // ❌ DELETE ITEM
      .addCase(deleteItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.actionLoading = false;

        // ✅ remove from list instantly
        state.items = state.items.filter(
          (item) => item._id !== action.payload.id,
        );
      })
      .addCase(deleteItem.rejected, (state) => {
        state.actionLoading = false;
      })

      // ✏️ UPDATE ITEM
      .addCase(updateItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.actionLoading = false;

        const updatedItem = action.payload;

        // ✅ update locally
        state.items = state.items.map((item) =>
          item._id === updatedItem._id ? updatedItem : item,
        );
      })
      .addCase(updateItem.rejected, (state) => {
        state.actionLoading = false;
      });
  },
});

export const { resetItems } = itemSlice.actions;

export default itemSlice.reducer;
