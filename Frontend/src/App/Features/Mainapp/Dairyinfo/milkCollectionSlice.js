// src/App/Features/Customers/Milk/milkCollectionSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

// Initial state with separate status and error for each thunk
const initialState = {
  customerInfo: {},
  milkRate: {},
  milkCollection: {},
  getCustInfoStatus: "idle",
  getCustInfoError: null,
  getMilkRateStatus: "idle",
  getMilkRateError: null,
  saveMilkCollectionStatus: "idle",
  saveMilkCollectionError: null,
};

// Async Thunk to get Customer Information
export const getCustInfo = createAsyncThunk(
  "milkCollection/getCustInfo",
  async ({ user_code }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/collection/custdata", {
        user_code,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Customer information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async Thunk to get Milk Rate
export const getMilkRate = createAsyncThunk(
  "milkCollection/getMilkRate",
  async ({ rccode, rcdate, fat, snf, liters }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/collection/milkrate", {
        rccode,
        rcdate,
        fat,
        snf,
        liters,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Milk Rate information.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async Thunk to Save Milk Collection
export const saveMilkCollection = createAsyncThunk(
  "milkCollection/saveMilkCollection",
  async ({ milkColl }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/save/milk/collection",
        milkColl
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to save Milk Collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Creating the Slice
const milkCollectionSlice = createSlice({
  name: "milkCollection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling getCustInfo
    builder
      .addCase(getCustInfo.pending, (state) => {
        state.getCustInfoStatus = "loading";
        state.getCustInfoError = null;
      })
      .addCase(getCustInfo.fulfilled, (state, action) => {
        state.getCustInfoStatus = "succeeded";
        state.customerInfo = action.payload.custdetails;
      })
      .addCase(getCustInfo.rejected, (state, action) => {
        state.getCustInfoStatus = "failed";
        state.getCustInfoError = action.payload;
      })

      // Handling getMilkRate
      .addCase(getMilkRate.pending, (state) => {
        state.getMilkRateStatus = "loading";
        state.getMilkRateError = null;
      })
      .addCase(getMilkRate.fulfilled, (state, action) => {
        state.getMilkRateStatus = "succeeded";
        state.milkRate = action.payload;
      })
      .addCase(getMilkRate.rejected, (state, action) => {
        state.getMilkRateStatus = "failed";
        state.getMilkRateError = action.payload;
      })

      // Handling saveMilkCollection
      .addCase(saveMilkCollection.pending, (state) => {
        state.saveMilkCollectionStatus = "loading";
        state.saveMilkCollectionError = null;
      })
      .addCase(saveMilkCollection.fulfilled, (state, action) => {
        state.saveMilkCollectionStatus = "succeeded";
        state.milkCollection = action.payload;
      })
      .addCase(saveMilkCollection.rejected, (state, action) => {
        state.saveMilkCollectionStatus = "failed";
        state.saveMilkCollectionError = action.payload;
      });
  },
});

export default milkCollectionSlice.reducer;
