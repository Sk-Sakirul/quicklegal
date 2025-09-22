import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api/admin";

// Fetch weekly booking stats & revenue
export const fetchBookingStats = createAsyncThunk(
  "admin/fetchBookingStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/admin/bookings`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch advocate stats
export const fetchAdvocateStats = createAsyncThunk(
  "admin/fetchAdvocateStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/admin/advocates`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch popular case types
export const fetchPopularCases = createAsyncThunk(
  "admin/fetchPopularCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/admin/cases/popular`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/admin/users`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  bookingStats: null,
  advocateStats: null,
  popularCases: [],
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Booking stats
      .addCase(fetchBookingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingStats = action.payload;
      })
      .addCase(fetchBookingStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch booking stats";
      })

      // Advocate stats
      .addCase(fetchAdvocateStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdvocateStats.fulfilled, (state, action) => {
        state.loading = false;
        state.advocateStats = action.payload;
      })
      .addCase(fetchAdvocateStats.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch advocate stats";
      })

      // Popular cases
      .addCase(fetchPopularCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularCases.fulfilled, (state, action) => {
        state.loading = false;
        state.popularCases = action.payload;
      })
      .addCase(fetchPopularCases.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch popular cases";
      })

      // All users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      });
  },
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;