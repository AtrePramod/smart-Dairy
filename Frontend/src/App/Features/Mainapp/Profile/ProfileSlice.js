import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  profile: {},
  status: "idle",
  error: null,
};

export const getProfileInfo = createAsyncThunk(
  "profile/getProfileInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/profile/info");
      return response.data.userData;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch profile information.";
      return rejectWithValue(errorMessage);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileInfo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(getProfileInfo.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
