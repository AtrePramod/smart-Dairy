import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  deductionInfo: {},
  subdeductions: [],
  status: "idle",
  error: null,
};

export const getDeductionInfo = createAsyncThunk(
  "deduction/get",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/deduction-info", {
        fromDate,
        toDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch deduction information.";
      return rejectWithValue(errorMessage);
    }
  }
);

const deductionSlice = createSlice({
  name: "deduction",
  initialState,
  reducers: {
    reset: () => initialState, // Add reset action to return the initial state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDeductionInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDeductionInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.deductionInfo = action.payload.mainDeduction;
        state.subdeductions = action.payload.otherDeductions;
      })
      .addCase(getDeductionInfo.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset: resetDeduction } = deductionSlice.actions; // Export the reset action
export default deductionSlice.reducer;
