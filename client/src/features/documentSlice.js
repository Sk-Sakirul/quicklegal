import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

// Fetch all available templates
export const fetchTemplates = createAsyncThunk(
  "documents/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/documents`, {
        withCredentials: true,
      });
      return response.data.templates;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Generate & upload document
export const generateDocument = createAsyncThunk(
  "documents/generate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/documents/generate`, formData, {
        withCredentials: true,
      });
      return response.data.document;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get one user all documents 
export const fetchUserDocuments = createAsyncThunk(
  "documents/fetchUserDocuments",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/documents/user/${userId}`, {
        withCredentials: true,
      });
      return response.data.documents;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  templates: [],
  userDocuments: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    resetDocumentState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch templates";
      })

      // Generate Document
      .addCase(generateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.userDocuments.push(action.payload);
      })
      .addCase(generateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to generate document";
      })

      // Fetch User Documents
      .addCase(fetchUserDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.userDocuments = action.payload;
      })
      .addCase(fetchUserDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch documents";
      });
  },
});

export const { resetDocumentState } = documentSlice.actions;
export default documentSlice.reducer;
