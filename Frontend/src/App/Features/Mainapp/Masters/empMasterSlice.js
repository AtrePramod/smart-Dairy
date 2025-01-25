import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  emplist: [],
  employee: {},
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  fetchStatus: "idle",
  findStatus: "idle",
  createError: null,
  updateError: null,
  deleteError: null,
  fetchError: null,
  findError: null,
};

// Create a new Employee
export const createEmp = createAsyncThunk(
  "emp/createEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create/employee", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Find Employee
export const findEmp = createAsyncThunk(
  "emp/findEmployee",
  async (code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/find/employee", code);
      return response.data.employee;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Employee
export const updateEmp = createAsyncThunk(
  "emp/updateEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/employee", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Employee
export const deleteEmp = createAsyncThunk(
  "emp/deleteEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/delete/employee", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Retrieve List of Employees
export const listEmployee = createAsyncThunk(
  "emp/listEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/list/employee", formData);
      return response.data.empList;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const empMasterSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearErrors(state) {
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.fetchError = null;
      state.findError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createEmployee actions
      .addCase(createEmp.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createEmp.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.emplist.push(action.payload);
      })
      .addCase(createEmp.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // Handle findEmployee actions
      .addCase(findEmp.pending, (state) => {
        state.findStatus = "loading";
      })
      .addCase(findEmp.fulfilled, (state, action) => {
        state.findStatus = "succeeded";
        state.employee = action.payload;
      })
      .addCase(findEmp.rejected, (state, action) => {
        state.findStatus = "failed";
        state.findError = action.payload;
      })

      // Handle updateEmployee actions
      .addCase(updateEmp.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateEmp.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.emplist.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.emplist[index] = action.payload;
        }
      })
      .addCase(updateEmp.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })

      // Handle deleteEmployee actions
      .addCase(deleteEmp.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteEmp.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.emplist = state.emplist.filter(
          (emp) => emp.id !== action.payload.id
        );
      })
      .addCase(deleteEmp.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = action.payload;
      })

      // Handle listEmployee actions
      .addCase(listEmployee.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(listEmployee.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.emplist = action.payload;
      })
      .addCase(listEmployee.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      });
  },
});

export const { clearErrors } = empMasterSlice.actions;
export default empMasterSlice.reducer;
