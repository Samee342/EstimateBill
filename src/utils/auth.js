import { jwtDecode } from "jwt-decode";

// ========================================
// UPDATE CURRENT USER (merge patch into cached user)
// ========================================

export const updateCurrentUser = (patch) => {
  const raw = localStorage.getItem("user");
  if (!raw || raw === "undefined") return null;

  try {
    const current = JSON.parse(raw);
    const next = {
      ...current,
      ...patch,
      // Deep-merge tenant if patch has a tenant object
      tenant: patch.tenant
        ? { ...(current.tenant ?? {}), ...patch.tenant }
        : current.tenant,
    };
    localStorage.setItem("user", JSON.stringify(next));

    // Notify same-tab listeners (custom event) — needed because storage event
    // only fires across tabs, not in the tab that made the change.
    window.dispatchEvent(
      new CustomEvent("auth:user-updated", { detail: next }),
    );

    return next;
  } catch (error) {
    console.error("updateCurrentUser: invalid stored user", error);
    return null;
  }
};
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
