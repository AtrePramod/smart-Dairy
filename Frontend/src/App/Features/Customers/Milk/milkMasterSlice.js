import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  mrecords: [],
  msummary: {
    totalLiters: 0,
    avgFat: 0,
    avgSnf: 0,
    avgRate: 0,
    totalAmount: 0,
  },
  status: "idle",
  error: null,
};

export const getMasterReports = createAsyncThunk(
  "masterreport/get",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/master/report", {
        fromDate,
        toDate,
      });
      return response.data; // Assuming the API response directly matches the `initialState` structure
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch master milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkMasterSlice = createSlice({
  name: "milk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMasterReports.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMasterReports.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.mrecords = action.payload.records;
        state.msummary = action.payload.summary;
      })
      .addCase(getMasterReports.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default milkMasterSlice.reducer;
