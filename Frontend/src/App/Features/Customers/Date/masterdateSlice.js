// import { createSlice } from "@reduxjs/toolkit";
// 
// const initialState = {
//   masterlist: [],
// };
// 
// const manualMasterSlice = createSlice({
//   name: "manualmaster",
//   initialState,
//   reducers: {
//     generateMaster(state, action) {
//       const currentDate = action.payload; // Get the current date from the payload
//       let year = parseInt(currentDate.slice(0, 4), 10); // Extract the year
//       let startMonth = 4; // Start from April (month 4)
//       let currentMonth = parseInt(currentDate.slice(5, 7), 10); // Extract the current month
// 
//       const masterlists = [];
// 
//       for (let month = startMonth; month <= currentMonth; month++) {
//         const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month
// 
//         // First slot: 1-10
//         masterlists.push({
//           start: `${year}-${String(month).padStart(2, "0")}-01`,
//           end: `${year}-${String(month).padStart(2, "0")}-10T00:00:00.000`,
//         });
// 
//         // Second slot: 11-20
//         masterlists.push({
//           start: `${year}-${String(month).padStart(2, "0")}-11`,
//           end: `${year}-${String(month).padStart(2, "0")}-20T00:00:00.000`,
//         });
// 
//         // Third slot: 21-end of month
//         masterlists.push({
//           start: `${year}-${String(month).padStart(2, "0")}-21`,
//           end: `${year}-${String(month).padStart(
//             2,
//             "0"
//           )}-${daysInMonth}T00:00:00.000`,
//         });
//       }
// 
//       state.masterlist = masterlists; // Update the state with the generated masterlist
//     },
//   },
// });
// 
// export const { generateMaster } = manualMasterSlice.actions;
// 
// export default manualMasterSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterlist: [],
};

const manualMasterSlice = createSlice({
  name: "manualmaster",
  initialState,
  reducers: {
    generateMaster(state, action) {
      const currentDate = action.payload; // Get the current date from the payload
      let year = parseInt(currentDate.slice(0, 4), 10); // Extract the year
      let startMonth = 4; // Start from April (month 4)
      let currentMonth = parseInt(currentDate.slice(5, 7), 10); // Extract the current month

      const masterlists = [];

      for (let month = startMonth; month <= currentMonth; month++) {
        const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month

        // First slot: 1-10
        masterlists.push({
          start: `${year}-${String(month).padStart(2, "0")}-01`,
          end: `${year}-${String(month).padStart(2, "0")}-10T00:00:00.000`,
        });

        // Second slot: 11-20
        masterlists.push({
          start: `${year}-${String(month).padStart(2, "0")}-11`,
          end: `${year}-${String(month).padStart(2, "0")}-20T00:00:00.000`,
        });

        // Third slot: 21-end of month
        masterlists.push({
          start: `${year}-${String(month).padStart(2, "0")}-21`,
          end: `${year}-${String(month).padStart(
            2,
            "0"
          )}-${daysInMonth}T00:00:00.000`,
        });
      }

      // Sort the masterlists array by the start date in descending order
      masterlists.sort((a, b) => new Date(b.start) - new Date(a.start));

      state.masterlist = masterlists; // Update the state with the sorted masterlist
    },
  },
});

export const { generateMaster } = manualMasterSlice.actions;

export default manualMasterSlice.reducer;
