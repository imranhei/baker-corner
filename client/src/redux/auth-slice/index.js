import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  isLoadingAuth: false,
  authChecked: false,
  role: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        data
      );
      return response.data;
    } catch (error) {
      // Return proper error message from backend
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong"
      );
    }
  }
);

export const checkAuth = createAsyncThunk("auth/check-auth", async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
});

// export const resetPassword = createAsyncThunk(
//   "auth/reset-password",
//   async (data) => {
//     const response = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
//       data
//     );
//     return response.data;
//   }
// );

// export const updateProfile = createAsyncThunk(
//   "user/update-profile",
//   async (data, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         `${import.meta.env.VITE_API_URL}/api/user`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Server error");
//     }
//   }
// );

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetTokenAndCredentials: (state) => {
      // no subdomain
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.clear();
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login fulfilled with payload:", action.payload);
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        localStorage.setItem("token", action.payload.token);
    })
    .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoadingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoadingAuth = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoadingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        state.authChecked = true;
      })
//       .addCase(resetPassword.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(resetPassword.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(resetPassword.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(updateProfile.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(updateProfile.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//       })
//       .addCase(updateProfile.rejected, (state) => {
//         state.isLoading = false;
//       });
  },
});

export const { resetTokenAndCredentials } = authSlice.actions;

export default authSlice.reducer;