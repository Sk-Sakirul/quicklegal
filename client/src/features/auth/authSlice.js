import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, {rejectWithValue}) => {
    try {
      const response = await axios.post(`${url}/auth/register`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login", 
  async (formData, {rejectWithValue}) => {
  try {
    const response = await axios.post(`${url}/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

// Logout User
export const logoutUser = createAsyncThunk(
  "auth/logout", 
  async () => {
  const response = await axios.post(
    `${url}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
});

// Check Auth/Profile
export const checkAuth = createAsyncThunk("auth/profile", async () => {
  const response = await axios.get(`${url}/auth/profile`, {
    withCredentials: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
  return response.data;
});

// ✅ Persisted state from localStorage
const userFromStorage = JSON.parse(localStorage.getItem("user"));
const initialState = {
  isAuthenticated: !!userFromStorage,
  isLoading: false,
  user: userFromStorage || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        if (action.payload.success) {
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })

      // Check Auth/Profile
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success;
        if (action.payload.success) {
          localStorage.setItem("user", JSON.stringify(action.payload.data));
        } else {
          localStorage.removeItem("user");
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
