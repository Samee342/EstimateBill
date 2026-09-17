// ========================================
// DEMO USERS
// ========================================

const users = [
  {
    id: 1,
    name: "PrintTech Admin",
    email: "admin@printtech.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "PrintTech Staff",
    email: "staff@printtech.com",
    password: "staff123",
    role: "staff",
  },
];

// ========================================
// STORAGE KEY
// ========================================

const CURRENT_USER_KEY = "currentUser";

// ========================================
// LOGIN USER
// ========================================

export const loginUser = (email, password) => {
  // Empty validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user
  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password
  );

  // User not found
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // ========================================
  // PASSWORD KO STORE NAHI KARNA
  // ========================================

  const loggedInUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  // ========================================
  // SAVE CURRENT USER
  // ========================================

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(loggedInUser)
  );

  return loggedInUser;
};

// ========================================
// GET CURRENT USER
// ========================================

export const getCurrentUser = () => {
  const user = localStorage.getItem(
    CURRENT_USER_KEY
  );

  // User login nahi hai
  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    // Agar localStorage ka data corrupt hai
    localStorage.removeItem(
      CURRENT_USER_KEY
    );

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
  localStorage.removeItem(
    CURRENT_USER_KEY
  );
};