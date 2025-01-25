import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  profileInfo: [],
  status: "idle",
  error: null,
};

export const getProfileInfo = createAsyncThunk(
  "profileInfo/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/customer/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
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
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profileInfo = action.payload.profileInfo;
        state.loading = false;
      })
      .addCase(getProfileInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;
