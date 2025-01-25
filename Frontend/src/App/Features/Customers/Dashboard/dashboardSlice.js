import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  dashboardInfo: [],
  status: "idle",
  error: null,
};

export const getDashboardInfo = createAsyncThunk(
  "dashboard/get",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/dashboard", {
        fromDate,
        toDate,
      });
      return response.data; // Ensure this matches your API response structure
    } catch (error) {
      const errorMessage =
        error.response?.data || "Failed to fetch dashboard information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice for managing dashboard state
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardInfo.pending, (state) => {
        state.status = "loading";
        state.dashboardInfo = []; // Optional: Clear existing data while loading
      })
      .addCase(getDashboardInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardInfo = action.payload.dashboardInfo; // Adjust this if necessary
      })
      .addCase(getDashboardInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
