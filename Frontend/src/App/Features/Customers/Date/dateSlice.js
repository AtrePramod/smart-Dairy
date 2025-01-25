import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toDate: "",
  formDate: "",
  yearStart: "",
  yearEnd: "",
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setToDate(state) {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      state.toDate = formattedDate;
    },
    setFormDate(state) {
      const day = state.toDate.slice(8, 10); // Extract day from toDate
      const date = state.toDate.slice(0, 8); // Extract YYYY-MM from toDate

      let startDay = "01"; // Default start day
      if (day <= 10) {
        startDay = "01";
      } else if (day <= 20) {
        startDay = "11";
      } else {
        startDay = "21";
      }

      // Set formDate
      state.formDate = date + startDay;

      // Calculate yearStart and yearEnd
      const year = state.toDate.slice(0, 4); // Extract year from toDate
      state.yearStart = `${year}-04-01`; // Fiscal year start (April 1st)
      state.yearEnd = `${Number(year) + 1}-03-31`; // Fiscal year end (March 31st of the next year)
    },
  },
});

export const { setToDate, setFormDate } = dateSlice.actions;
export default dateSlice.reducer;
