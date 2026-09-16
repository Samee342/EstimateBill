import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { lazy, useEffect } from "react";
import { useSelector } from "react-redux";

// ========================================
// PUBLIC PAGES
// ========================================

const Login = lazy(() => import("./pages/auth/LoginPage"));

const Register = lazy(() => import("./pages/auth/RegisterPage"));

const ForgotPassword = lazy(
  () => import("./pages/auth/ForgotPasswordPage")
);

const SetupPage = lazy(
  () => import("./pages/auth/SetupPage")
);

// ========================================
// ADMIN LAYOUT
// ========================================

const AdminLayout = lazy(
  () => import("./layout/AdminLayout")
);

// ========================================
// DASHBOARD
// ========================================

const Home = lazy(
  () => import("./pages/HomePage")
);

// ========================================
// PROJECT PAGES
// ========================================

const ProjectPage = lazy(
  () => import("./pages/project/AllProject")
);

const CreateProject = lazy(
  () => import("./pages/project/CreateProject")
);

// ========================================
// CUSTOMER PAGES
// ========================================

const AllCustomers = lazy(
  () => import("./pages/customers/AllCustomersPage")
);

const AddCustomer = lazy(
  () => import("./pages/customers/AddCustomer")
);

// ========================================
// REPORT PAGES
// ========================================

const SalesReport = lazy(
  () => import("./pages/Reports/SalesReport")
);

const CustomerReport = lazy(
  () => import("./pages/Reports/CustomerReport")
);

const PaymentReport = lazy(
  () => import("./pages/Reports/PaymentReport")
);

// ========================================
// NOTIFICATION
// ========================================

const Notification = lazy(
  () => import("./pages/Notification/Notification")
);

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            PUBLIC PAGES
        ======================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/setup"
          element={<SetupPage />}
        />

        {/* ========================================
            ADMIN DASHBOARD
        ======================================== */}

        <Route element={<AdminLayout />}>

          {/* Dashboard */}
          <Route
            index
            element={<Home />}
          />

          {/* Optional /dashboard URL */}
          <Route
            path="/dashboard"
            element={<Home />}
          />

          {/* ======================================
              PROJECTS
          ====================================== */}

          <Route
            path="/projects"
            element={<ProjectPage />}
          />

          <Route
            path="/projects/create-project"
            element={<CreateProject />}
          />

          {/* ======================================
              CUSTOMERS
          ====================================== */}

          <Route
            path="/customers"
            element={<AllCustomers />}
          />

          <Route
            path="/customers/add"
            element={<AddCustomer />}
          />

          {/* ======================================
              REPORTS
          ====================================== */}

          <Route
            path="/reports/sales"
            element={<SalesReport />}
          />

          <Route
            path="/reports/customers"
            element={<CustomerReport />}
          />

          <Route
            path="/reports/payments"
            element={<PaymentReport />}
          />

          {/* ======================================
              NOTIFICATIONS
          ====================================== */}

          <Route
            path="/notifications"
            element={<Notification />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;