import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance"; // Adjust the path as necessary

// Initial state
const initialState = {
  status: "idle",
  createcstatus: "idle",
  error: null,
  maxId: null,
  centerData: {},
  centersList: [],
  loading: false,
  success: false,
};

// Async thunk for fetching the maximum center ID
export const maxCenterId = createAsyncThunk(
  "center/maxcenterid",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/center/maxid");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to get maximum center id.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for creating a new center
export const createCenter = createAsyncThunk(
  "center/createcenter",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/center", formData);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create new center.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating center details
export const updateCenterDetails = createAsyncThunk(
  "center/updatecenterdetails",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/update/centerdetails",
        formData
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update center details.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching details of a specific center
export const centerDetails = createAsyncThunk(
  "center/centerDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/center/details`);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch center details.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching all center lists
export const centersLists = createAsyncThunk(
  "center/centerlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/all/centerdetails");
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch all center lists.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const centerSlice = createSlice({
  name: "center",
  initialState,
  reducers: {
    reset: () => initialState, // Resets the state to initial values
    resetUpdateState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle max center ID actions
    builder
      .addCase(maxCenterId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(maxCenterId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maxId = action.payload;
      })
      .addCase(maxCenterId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle center creation actions
      .addCase(createCenter.pending, (state) => {
        state.createcstatus = "loading";
      })
      .addCase(createCenter.fulfilled, (state, action) => {
        state.createcstatus = "succeeded";
        state.success = true;
        state.centerData = { ...state.centerData, ...action.payload };
      })
      .addCase(createCenter.rejected, (state, action) => {
        state.createcstatus = "failed";
        state.error = action.payload;
      })
      // Handle fetching single center details
      .addCase(centerDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(centerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.centerData = action.payload.centerinfo; // Store the specific center details
      })
      .addCase(centerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle fetching the list of all centers
      .addCase(centersLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(centersLists.fulfilled, (state, action) => {
        state.loading = false;
        state.centersList = action.payload; // Store the list of all centers
      })
      .addCase(centersLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


// Export actions and reducer
export const { reset, resetUpdateState } = centerSlice.actions;
export default centerSlice.reducer;
