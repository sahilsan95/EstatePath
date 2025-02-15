import { combineReducers, configureStore } from "@reduxjs/toolkit"; // Import necessary functions from Redux Toolkit
import userReducer from "./user/userSlice"; // Import the user reducer to manage user state
import { persistReducer, persistStore } from "redux-persist"; // Import functions for state persistence
import storage from "redux-persist/lib/storage"; // Import storage engine (localStorage by default)

const rootReducer = combineReducers({ user: userReducer }); // Combine reducers; here, only the user reducer is included

const persistConfig = {
  key: "root", // Key used to store the root state in localStorage
  storage, // Use localStorage for state persistence
  version: 1, // Versioning to manage state migrations if needed
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a persisted reducer using the configuration

// Configure the Redux store with the persisted reducer and middleware
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for non-serializable data (e.g., functions)
    }),
});

export const persistor = persistStore(store); // Create a persistor for the store to handle persistence

