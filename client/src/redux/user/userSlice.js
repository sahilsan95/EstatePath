import { createSlice } from "@reduxjs/toolkit"; // Import createSlice from Redux Toolkit

// Initial state for the user slice
const initialState = {
  currentUser: null, // Stores the currently signed-in user
  error: null, // Stores any error messages
  loading: false, // Indicates loading state for async actions
};

// Create a slice for user-related state and actions
const userSlice = createSlice({
  name: "user", // Name of the slice
  initialState, // Initial state defined above
  reducers: {
    // Action to set loading state when signing in starts
    signInStart: (state) => {
      state.loading = true;
    },
    // Action to handle successful sign-in
    signInSuccess: (state, action) => {
      state.currentUser = action.payload; // Set currentUser to the payload (user data)
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous errors
    },
    // Action to handle sign-in failure
    signInFailure: (state, action) => {
      state.error = action.payload; // Set error to the payload (error message)
      state.loading = false; // Set loading to false
    },
    // Action to set loading state when updating user starts
    updateUserStart: (state) => {
      state.loading = true;
    },
    // Action to handle successful user update
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload; // Update currentUser with new data
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous errors
    },
    // Action to handle user update failure
    updateUserFailure: (state, action) => {
      state.error = action.payload; // Set error to the payload (error message)
      state.loading = false; // Set loading to false
    },
    // Action to set loading state when deleting user starts
    deleteUserStart: (state) => {
      state.loading = true;
    },
    // Action to handle successful user deletion
    deleteUserSuccess: (state) => {
      state.currentUser = null; // Clear currentUser
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous errors
    },
    // Action to handle user deletion failure
    deleteUserFailure: (state, action) => {
      state.error = action.payload; // Set error to the payload (error message)
      state.loading = false; // Set loading to false
    },
    // Action to set loading state when signing out starts
    signOutUserStart: (state) => {
      state.loading = true;
    },
    // Action to handle successful sign-out
    signOutUserSuccess: (state) => {
      state.currentUser = null; // Clear currentUser
      state.loading = false; // Set loading to false
      state.error = null; // Clear any previous errors
    },
    // Action to handle sign-out failure
    signOutUserFailure: (state, action) => {
      state.error = action.payload; // Set error to the payload (error message)
      state.loading = false; // Set loading to false
    },
  },
});

// Export actions for use in components
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;

