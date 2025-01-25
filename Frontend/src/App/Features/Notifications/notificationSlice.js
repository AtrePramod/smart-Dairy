import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const initialState = {
  tokenExists: false, // Updated to clarify meaning
  fcmToken: "",
  status: "idle",
  error: null,
};

// Save FCM token to database
export const saveFCMTokenToDB = createAsyncThunk(
  "fcm/saveToken",
  async ({ token, cust_no }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/fcm/token", {
        token,
        cust_no,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to save FCM token in database.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Check if FCM token exists in the database
export const checkExistingFCMTokens = createAsyncThunk(
  "fcm/checkToken",
  async ({ cust_no }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/check/fcm/token", {
        cust_no,
      });
      return response.data; // Expected to contain { exists: true/false }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to check existing FCM token in database.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch FCM tokens
export const fetchFCMTokens = createAsyncThunk(
  "fcm/fetchTokens",
  async (cust_no, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/get/fcm/token", cust_no);
      return response.data.fcm_token;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch FCM token in database.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Send Notification

export const sendNewNotification = createAsyncThunk(
  "fcm/sendNewNotification",
  async ({ title, body, deviceToken }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/send/notification", {
        title,
        body,
        deviceToken,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to send notification.";
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveFCMTokenToDB.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveFCMTokenToDB.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(saveFCMTokenToDB.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkExistingFCMTokens.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkExistingFCMTokens.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.tokenExists = action.payload.tokenExists;
      })
      .addCase(checkExistingFCMTokens.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFCMTokens.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFCMTokens.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fcmToken = action.payload;
        state.error = null;
      })
      .addCase(fetchFCMTokens.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(sendNewNotification.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendNewNotification.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(sendNewNotification.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
