import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import { getCurrentUser } from "../utils/auth"; // ← adjust path

// Hydrate auth from localStorage at boot
const cachedUser = getCurrentUser();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    // ...your other reducers unchanged
  },
  preloadedState: {
    auth: {
      user: cachedUser,
      isAuthenticated: !!cachedUser,
      loading: false,
    },
  },
});
