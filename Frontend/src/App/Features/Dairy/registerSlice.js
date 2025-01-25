import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance"; // Adjust the path as necessary

// Initial state
const initialState = {
  status: "idle",
  updateDDstatus: "idle",
  error: null,
  userData: null,
  dairyData: {},
  loading: false,
  success: false,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (
    {
      dairy_name,
      user_name,
      user_phone,
      user_city,
      user_pincode,
      user_password,
      terms,
      prefix,
      date,
      endDate,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/register", {
        dairy_name,
        user_name,
        user_phone,
        user_city,
        user_pincode,
        user_password,
        terms,
        prefix,
        date,
        endDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to register.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating dairy details
export const updateDairyDetails = createAsyncThunk(
  "register/updateDairyDetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/dairyinfo", formData);
      return response.data; // Adjust according to your response structure
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update dairy information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    reset: () => initialState, // Resets the state to initial values
    resetUpdateState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle registration actions
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.userData = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle dairy update actions
      .addCase(updateDairyDetails.pending, (state) => {
        state.updateDDstatus = "loading";
      })
      .addCase(updateDairyDetails.fulfilled, (state, action) => {
        state.updateDDstatus = false;
        state.success = "succeeded"; // Mark the update as successful
        state.dairyData = { ...state.dairyData, ...action.payload };
      })
      .addCase(updateDairyDetails.rejected, (state, action) => {
        state.updateDDstatus = "failed";
        state.error = action.payload; // Capture the error
      });
  },
});

// Export actions and reducer
export const { reset, resetUpdateState } = registerSlice.actions;
export default registerSlice.reducer;
