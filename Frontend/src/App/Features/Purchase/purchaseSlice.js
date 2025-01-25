import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  purchaseBill: [],
  psummary: {},
  status: "idle",
  error: null,
};

export const getPurchaseBill = createAsyncThunk(
  "purchase/get",
  async ({ formDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/sales/report", {
        formDate,
        toDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Sales reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    reset: () => initialState, // Add reset action to return the initial state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPurchaseBill.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPurchaseBill.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.purchaseBill = action.payload.purchaseBill;
        state.psummary = action.payload.psummary;
      })
      .addCase(getPurchaseBill.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { reset: resetPurchase } = purchaseSlice.actions; // Export the reset action
export default purchaseSlice.reducer;
