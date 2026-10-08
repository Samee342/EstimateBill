import { jwtDecode } from "jwt-decode";

// ========================================
// GET CURRENT USER
// ========================================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");

  // No user or no token
  if (!user || user === "undefined" || !token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Check token expiration
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log("Access token expired");

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("Invalid authentication data:", error);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    return null;
  }
};


// ========================================
// GET USER ROLE
// ========================================

export const getUserRole = () => {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  return user.role;
};


// ========================================
// CHECK ROLE
// ========================================

export const hasRole = (role) => {
  const user = getCurrentUser();

  if (!user) {
    return false;
  }

  return user.role === role;
};


// ========================================
// CHECK AUTHENTICATION
// ========================================

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};


// ========================================
// LOGOUT USER
// ========================================

export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};