import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

// Create a new case
export const createCase = createAsyncThunk(
  "cases/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/cases/create`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get logged-in user's cases
export const fetchMyCases = createAsyncThunk(
  "cases/fetchMyCases",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/cases/my`, {
        withCredentials: true,
      });
      return response.data.myCases;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  myCases: [],
  createCaseLoading: false,
  fetchCasesLoading: false,
  createCaseError: null,
  fetchCasesError: null,
};

const caseSlice = createSlice({
  name: "case",
  initialState,
  reducers: {
    resetCaseState: (state) => {
      state.createCaseError = null;
      state.fetchCasesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Case
      .addCase(createCase.pending, (state) => {
        state.createCaseLoading = true;
        state.createCaseError = null;
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.createCaseLoading = false;
        state.myCases.push(action.payload.case);
      })
      .addCase(createCase.rejected, (state, action) => {
        state.createCaseLoading = false;
        state.createCaseError =
          action.payload?.message || "Failed to create case";
      })

      // Fetch My Cases
      .addCase(fetchMyCases.pending, (state) => {
        state.fetchCasesLoading = true;
        state.fetchCasesError = null;
      })
      .addCase(fetchMyCases.fulfilled, (state, action) => {
        state.fetchCasesLoading = false;
        state.myCases = action.payload;
      })
      .addCase(fetchMyCases.rejected, (state, action) => {
        state.fetchCasesLoading = false;
        state.fetchCasesError =
          action.payload?.message || "Failed to fetch cases";
      });
  },
});

export const { resetCaseState } = caseSlice.actions;
export default caseSlice.reducer;
