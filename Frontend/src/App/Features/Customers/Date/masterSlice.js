import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

// Initial state
const initialState = {
  masterlist: [], // This should match your selector
  status: "idle",
  error: null,
};

// Thunk to fetch master dates
export const getMasterDates = createAsyncThunk(
  "masters/getMasterDates", // Updated action type
  async ({ yearStart, yearEnd }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dairy/masters", {
        yearStart,
        yearEnd,
      });
      return response.data.getMasters; // Adjust according to actual response
    } catch (error) {
      console.error("API Error:", error); // Debugging
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Redux slice
const masterSlice = createSlice({
  name: "masters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMasterDates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMasterDates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.masterlist = action.payload;
      })
      .addCase(getMasterDates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the reducer
export default masterSlice.reducer;
