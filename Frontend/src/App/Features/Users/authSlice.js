// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', values);
      return response.data.user_role; // Contains user_role
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const userDesignation = createAsyncThunk(
  "auth/designation",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/login", credentials);
      return response.data; // Contains user_role
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userRole: "",
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.userRole = action.payload.userRole; // Save userRole to state
    },
    logout: (state) => {
      state.userRole = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_password");
      localStorage.removeItem("rememberMe");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userRole = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
