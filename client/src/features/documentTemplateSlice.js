import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url =
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:3000/api/document-templates";

// Fetch all templates
export const fetchTemplates = createAsyncThunk(
  "documentTemplate/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/`, { withCredentials: true });
      return response.data.templates;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Upload new template
export const uploadTemplate = createAsyncThunk(
  "documentTemplate/uploadTemplate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.template;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update template
export const updateTemplate = createAsyncThunk(
  "documentTemplate/updateTemplate",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/${id}`, data, {
        withCredentials: true,
      });
      return response.data.template;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Delete template
export const deleteTemplate = createAsyncThunk(
  "documentTemplate/deleteTemplate",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${url}/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  templates: [],
  loading: false,
  error: null,
};

const documentTemplateSlice = createSlice({
  name: "documentTemplate",
  initialState,
  reducers: {
    resetTemplateState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch templates
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

      // Upload template
      .addCase(uploadTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(uploadTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to upload template";
      })

      // Update template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.templates[index] = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update template";
      })

      // Delete template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(
          (t) => t._id !== action.payload
        );
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete template";
      });
  },
});

export const { resetTemplateState } = documentTemplateSlice.actions;
export default documentTemplateSlice.reducer;
