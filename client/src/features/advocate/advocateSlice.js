import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// Initial state
const initialState = {
  advocates: [],
  advocate: null,
  isLoading: false,
  error: null,
};

// ✅ Fetch all advocates
export const fetchAdvocates = createAsyncThunk(
  "advocates/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/advocates`, {
        withCredentials: true,
      });
      return response.data?.advocates || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch advocates"
      );
    }
  }
);

// ✅ Fetch single advocate by ID
export const fetchAdvocateById = createAsyncThunk(
  "advocates/fetchById",
  async (advocateId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/api/advocates/${advocateId}`, {
        withCredentials: true,
      });
      return response.data?.advocate || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch advocate"
      );
    }
  }
);

// ✅ Create or update an advocate
export const createOrUpdateAdvocate = createAsyncThunk(
  "advocates/createOrUpdate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/api/advocates`, formData, {
        withCredentials: true,
      });
      return response.data?.advocate || null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create/update advocate"
      );
    }
  }
);

const advocateSlice = createSlice({
  name: "advocates",
  initialState,
  reducers: {
    clearAdvocate: (state) => {
      state.advocate = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all advocates
      .addCase(fetchAdvocates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdvocates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advocates = action.payload;
      })
      .addCase(fetchAdvocates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch single advocate
      .addCase(fetchAdvocateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdvocateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advocate = action.payload;
      })
      .addCase(fetchAdvocateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create or update advocate
      .addCase(createOrUpdateAdvocate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrUpdateAdvocate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advocate = action.payload;
      })
      .addCase(createOrUpdateAdvocate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdvocate, clearError } = advocateSlice.actions;
export default advocateSlice.reducer;
