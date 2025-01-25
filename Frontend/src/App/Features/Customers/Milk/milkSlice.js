import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  records: [],
  summary: {
    totalLiters: 0,
    avgFat: 0,
    avgSnf: 0,
    avgRate: 0,
    totalAmount: 0,
  },
  status: "idle",
  error: null,
};

export const getMilkReports = createAsyncThunk(
  "milkreport/get",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/milkreport", {
        fromDate,
        toDate,
      });
      return response.data; // Assuming the API response directly matches the `initialState` structure
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkSlice = createSlice({
  name: "milk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMilkReports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMilkReports.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.records = action.payload.records;
        state.summary = action.payload.summary;
      })
      .addCase(getMilkReports.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default milkSlice.reducer;
