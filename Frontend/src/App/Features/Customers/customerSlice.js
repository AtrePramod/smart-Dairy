import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  customerlist: [],
  maxCustNo: "",
  status: "idle",
  error: null,
};

// get max customer no
export const getMaxCustNo = createAsyncThunk(
  "customer/getMaxCustNo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/maxcustno");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new customer
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/customer", formData);
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// List all customers
export const listCustomer = createAsyncThunk(
  "customer/listCustomer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/list");
      return response.data.customerList; // return the response data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder // Handle getMaxCustNo actions
      .addCase(getMaxCustNo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMaxCustNo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxCustNo = action.payload.cust_no;
      })
      .addCase(getMaxCustNo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle createCustomer actions
      .addCase(createCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customerlist.push(action.payload); // Add the new customer to the list
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle listCustomer actions
      .addCase(listCustomer.pending, (state) => {
        state.status = "loading";
      })
      .addCase(listCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customerlist = action.payload; // Replace the customer list with the fetched data
      })
      .addCase(listCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
