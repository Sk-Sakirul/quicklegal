import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

// Create booking with payment
export const createBooking = createAsyncThunk(
  "booking/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/bookings`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Confirm payment
export const confirmBookingPayment = createAsyncThunk(
  "bookings/confirmPayment",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/bookings/confirm`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get user bookings
export const fetchUserBookings = createAsyncThunk(
  "booking/userBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/bookings/user/my`, {
        withCredentials: true,
      });
      return response.data.bookings;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Get advocate bookings
export const fetchAdvocateBookings = createAsyncThunk(
  "booking/advocateBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/bookings/advocate`, {
        withCredentials: true,
      });
      return response.data.bookings;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const initialState = {
  bookings: [],
  advocateBookings: [],
  bookingLoading: false,
  bookingError: null,
  paymentStatus: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.bookingError = null;
      state.paymentStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.paymentStatus = "pending";
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload?.message || "Booking failed";
      })

      // Confirm Payment
      .addCase(confirmBookingPayment.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(confirmBookingPayment.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.paymentStatus = "paid";

        // Update the booking in bookings array
        const index = state.bookings.findIndex(
          (b) => b.booking._id === action.payload.booking._id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
      })
      .addCase(confirmBookingPayment.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload?.message || "Payment failed";
      })

      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError =
          action.payload?.message || "Failed to fetch bookings";
      })

      // Fetch advocate bookings
      .addCase(fetchAdvocateBookings.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(fetchAdvocateBookings.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.advocateBookings = action.payload;
      })
      .addCase(fetchAdvocateBookings.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError =
          action.payload?.message || "Failed to fetch advocate bookings";
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;