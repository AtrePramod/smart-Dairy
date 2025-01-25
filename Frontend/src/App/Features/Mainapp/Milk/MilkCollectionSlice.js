import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  records: [],
  collectionReport: [],
  allMilkColl: [],
  allMilkCollector: [],
  mobileColl: [],
  mobileCollection: [], //update mobile milk collection
  PrevLiters: [], //Previous liters
  todaysMilk: [],
  status: "idle",
  milkstatus: "idle",
  allmilkstatus: "idle",
  allmilkcollstatus: "idle",
  tmstatus: "idle",
  error: null,
};

export const saveMilkCollSetting = createAsyncThunk(
  "milkreport/saveMilkCollSetting",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/Milkcoll/settings", {
        fromDate,
        toDate,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveMilkCollection = createAsyncThunk(
  "milkreport/saveMilkCollection",
  async ({ values }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/milk/collection", {
        values,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const saveMilkOneEntry = createAsyncThunk(
  "milkreport/saveMilkOneEntry",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/save/milk/one", values);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTodaysMilk = createAsyncThunk(
  "milkreport/fetchTodaysMilk",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/collection", {
        params: { date },
      });
      return response.data.todaysmilk;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//...............................................................................
//Mobile Milk Collection ........................................................
//...............................................................................

export const mobileMilkCollection = createAsyncThunk(
  "milkreport/mobileMilkCollection",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/save/mobile/milkcollection",
        values
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store Mobile milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Mobile Milk Collection Report
export const mobileMilkCollReport = createAsyncThunk(
  "milkreport/mobileMilkCollReport",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/mobile/milkreport", {
        params: { date },
      });
      return response.data.mobileMilk;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to store Mobile milk collection.";
      return rejectWithValue(errorMessage);
    }
  }
);

//Mobile Milk Collection Previous Liters
export const mobilePrevLiters = createAsyncThunk(
  "milkreport/mobilePrevLiters",
  async ({ date }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/mobile/prevliters", {
        params: { date },
      });
      return response.data.PrevLiters;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch Previous Liters.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch Mobile milk collection report
export const getMilkCollReport = createAsyncThunk(
  "milkreport/getMilkCollReport",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dairy/Milkcoll/report");
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

// fetch mobile milk collection to update
export const fetchMobileColl = createAsyncThunk(
  "milkreport/fetchMobileColl",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/fetch/mobile/collection");
      return response.data.mobileMilkcoll;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

//  Update MObile Milk Collection

export const updateMobileColl = createAsyncThunk(
  "milkreport/getMilkCollReport",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/update/mobile/coll", values);
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

// dairy milk Collection report (fillter)
export const getAllMilkCollReport = createAsyncThunk(
  "milkreport/getAllMilkCollReport",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/milk/coll/report", {
        params: { fromDate, toDate }, // Use the `params` key for query parameters
      });
      return response.data.milkcollection;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

//milk collector milk collection
export const getAllMilkSankalan = createAsyncThunk(
  "milkreport/getAllMilkSankalan",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/milk/sankalan", {
        params: { fromDate, toDate }, // Use the `params` key for query parameters
      });
      return response.data.milkCollectorcoll;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "Failed to fetch milk reports.";
      return rejectWithValue(errorMessage);
    }
  }
);

const milkCollectionSlice = createSlice({
  name: "milkCollection",
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveMilkCollSetting.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkCollSetting.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveMilkCollSetting.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveMilkCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkCollection.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveMilkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveMilkOneEntry.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveMilkOneEntry.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(saveMilkOneEntry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(mobileMilkCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(mobileMilkCollection.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(mobileMilkCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMobileColl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMobileColl.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mobileCollection = action.payload;
      })
      .addCase(fetchMobileColl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateMobileColl.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMobileColl.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateMobileColl.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(mobileMilkCollReport.pending, (state) => {
        state.milkstatus = "loading";
        state.error = null;
      })
      .addCase(mobileMilkCollReport.fulfilled, (state, action) => {
        state.milkstatus = "succeeded";
        state.mobileColl = action.payload;
      })
      .addCase(mobileMilkCollReport.rejected, (state, action) => {
        state.milkstatus = "failed";
        state.error = action.payload;
      })
      .addCase(mobilePrevLiters.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(mobilePrevLiters.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.PrevLiters = action.payload;
      })
      .addCase(mobilePrevLiters.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllMilkCollReport.pending, (state) => {
        state.allmilkstatus = "loading";
        state.error = null;
      })
      .addCase(getAllMilkCollReport.fulfilled, (state, action) => {
        state.allmilkstatus = "succeeded";
        state.allMilkColl = action.payload;
      })
      .addCase(getAllMilkCollReport.rejected, (state, action) => {
        state.allmilkstatus = "failed";
        state.error = action.payload;
      })
      .addCase(getAllMilkSankalan.pending, (state) => {
        state.allmilkcollstatus = "loading";
        state.error = null;
      })
      .addCase(getAllMilkSankalan.fulfilled, (state, action) => {
        state.allmilkcollstatus = "succeeded";
        state.allMilkCollector = action.payload;
      })
      .addCase(getAllMilkSankalan.rejected, (state, action) => {
        state.allmilkcollstatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTodaysMilk.pending, (state) => {
        state.tmstatus = "loading";
        state.error = null;
      })
      .addCase(fetchTodaysMilk.fulfilled, (state, action) => {
        state.tmstatus = "succeeded";
        state.todaysMilk = action.payload;
      })
      .addCase(fetchTodaysMilk.rejected, (state, action) => {
        state.tmstatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setEntries, addEntry } = milkCollectionSlice.actions;

export const fetchEntries = () => (dispatch) => {
  const allEntries = JSON.parse(localStorage.getItem("milkentries")) || [];
  dispatch(setEntries(allEntries));
};

export default milkCollectionSlice.reducer;
