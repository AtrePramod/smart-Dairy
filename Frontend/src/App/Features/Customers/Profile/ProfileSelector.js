import { createSelector } from "reselect";

// Input selector: selects the profile slice from the state
const selectProfileState = (state) => state.profile;

// Memoized selector: gets profile info
export const selectProfileInfo = createSelector(
  [selectProfileState],
  (profileState) => profileState.profileInfo
);

// Memoized selector: gets loading status
export const selectProfileStatus = createSelector(
  [selectProfileState],
  (profileState) => profileState.status
);

// Memoized selector: gets error
export const selectProfileError = createSelector(
  [selectProfileState],
  (profileState) => profileState.error
);
