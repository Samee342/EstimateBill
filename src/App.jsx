import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";

import RouteMeta from "./components/RouteMeta";
import { getCurrentUser } from "./utils/auth";

/* ======================================================
   PUBLIC PAGES
====================================================== */

const Login = lazy(() => import("./pages/auth/LoginPage"));

const Register = lazy(() =>
  import("./pages/auth/RegisterPage")
);

const ForgotPassword = lazy(() =>
  import("./pages/auth/ForgotPasswordPage")
);

const SetupPage = lazy(() =>
  import("./pages/auth/SetupPage")
);

/* ======================================================
   LAYOUTS
====================================================== */

const AdminLayout = lazy(() =>
  import("./layout/AdminLayout")
);

const StaffLayout = lazy(() =>
  import("./layout/StaffLayout")
);

/* ======================================================
   ADMIN PAGES
====================================================== */

/* ================= DASHBOARD ================= */

const Home = lazy(() =>
  import("./pages/HomePage")
);

/* ================= PROJECTS ================= */

const ProjectPage = lazy(() =>
  import("./pages/project/AllProject")
);

const CreateProject = lazy(() =>
  import("./pages/project/CreateProject")
);

/* ================= CUSTOMERS ================= */

const AllCustomers = lazy(() =>
  import("./pages/customers/AllCustomersPage")
);

const AddCustomer = lazy(() =>
  import("./pages/customers/AddCustomer")
);

/* ================= TEAM ================= */

/*
  Team is Admin-side staff management.

  Existing:
  src/pages/staff/
  is used for Staff-side pages.

  New:
  src/pages/team/
  is used for Admin-side team management.
*/

const AllTeam = lazy(() =>
  import("./pages/team/AllTeam")
);

const AddTeamMember = lazy(() =>
  import("./pages/team/AddTeamMember")
);

/* ================= REPORTS ================= */

const SalesReport = lazy(() =>
  import("./pages/Reports/SalesReport")
);

const CustomerReport = lazy(() =>
  import("./pages/Reports/CustomerReport")
);

const PaymentReport = lazy(() =>
  import("./pages/Reports/PaymentReport")
);

/* ================= NOTIFICATIONS ================= */

const Notification = lazy(() =>
  import("./pages/Notification/Notification")
);

/* ================= SETTINGS ================= */

const ResetCleanup = lazy(() =>
  import("./pages/settings/ResetCleanup")
);

const StudioSettings = lazy(() =>
  import("./pages/settings/StudioSettings")
);

/* ================= TRASH ================= */

const Trash = lazy(() =>
  import("./pages/Trash/trash")
);

/* ======================================================
   STAFF PAGES
====================================================== */

/* ================= DASHBOARD ================= */

const StaffDashboard = lazy(() =>
  import("./pages/staff/StaffDashboard")
);

/* ================= TASKS ================= */

const StaffTasks = lazy(() =>
  import("./pages/staff/StaffTasks")
);

/* ================= ORDERS ================= */

const StaffOrders = lazy(() =>
  import("./pages/staff/StaffOrders")
);

const StaffOrderDetails = lazy(() =>
  import("./pages/staff/StaffOrderDetails")
);

/* ================= CUSTOMERS ================= */

const StaffCustomers = lazy(() =>
  import("./pages/staff/StaffCustomers")
);

/* ================= PROFILE ================= */

const StaffProfile = lazy(() =>
  import("./pages/staff/StaffProfile")
);

/* ======================================================
   LOADING SCREEN
====================================================== */

const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">

        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600 dark:border-slate-700 dark:border-t-orange-500" />

        <p className="text-sm text-slate-500">
          Loading...
        </p>

      </div>
    </div>
  );
};

/* ======================================================
   ADMIN ROUTE PROTECTION
====================================================== */

const AdminRoute = ({ children }) => {
  const user = getCurrentUser();

  /* User not logged in */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* Logged in but not admin */

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/staff"
        replace
      />
    );
  }

  return children;
};

/* ======================================================
   STAFF ROUTE PROTECTION
====================================================== */

const StaffRoute = ({ children }) => {
  const user = getCurrentUser();

  /* User not logged in */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* Logged in but not staff */

  if (user.role !== "staff") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

/* ======================================================
   ROOT REDIRECT
====================================================== */

const RootRedirect = () => {
  const user = getCurrentUser();

  /* No user */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* Admin */

  if (user.role === "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  /* Staff */

  if (user.role === "staff") {
    return (
      <Navigate
        to="/staff"
        replace
      />
    );
  }

  /* Unknown role */

  return (
    <Navigate
      to="/login"
      replace
    />
  );
};

/* ======================================================
   404 PAGE
====================================================== */

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">

      <div className="text-center">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <span className="text-2xl font-bold text-slate-400">
            404
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="mt-6 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          Go Home
        </button>

      </div>

    </div>
  );
};

/* ======================================================
   APP
====================================================== */

function App() {

  /* ====================================================
     REDUX THEME
  ==================================================== */

  const theme = useSelector(
    (state) => state.theme.theme
  );

  /* ====================================================
     DARK MODE
  ==================================================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  /* ====================================================
     ROUTER
  ==================================================== */

  return (
    <BrowserRouter>

      {/* Route Meta */}

      <RouteMeta />

      <Suspense fallback={<LoadingScreen />}>

        <Routes>

          {/* ==================================================
              PUBLIC
          ================================================== */}

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

          {/* ==================================================
              ROOT
          ================================================== */}

          <Route
            path="/"
            element={<RootRedirect />}
          />

          {/* ==================================================
              ADMIN
          ================================================== */}

          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >

            {/* ================= DASHBOARD ================= */}

            <Route
              path="/dashboard"
              element={<Home />}
            />

            {/* ================= PROJECTS ================= */}

            <Route
              path="/projects"
              element={<ProjectPage />}
            />

            <Route
              path="/projects/create-project"
              element={<CreateProject />}
            />

            {/* ================= CUSTOMERS ================= */}

            <Route
              path="/customers"
              element={<AllCustomers />}
            />

            <Route
              path="/customers/add"
              element={<AddCustomer />}
            />

            {/* ==================================================
                TEAM
            ================================================== */}

            <Route
              path="/team"
              element={<AllTeam />}
            />

            <Route
              path="/team/add"
              element={<AddTeamMember />}
            />

            {/* ================= REPORTS ================= */}

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

            {/* ================= NOTIFICATIONS ================= */}

            <Route
              path="/notifications"
              element={<Notification />}
            />

            {/* ================= SETTINGS ================= */}

            <Route
              path="/settings/studio"
              element={<StudioSettings />}
            />

            <Route
              path="/settings/reset-cleanup"
              element={<ResetCleanup />}
            />

            {/* ================= TRASH ================= */}

            <Route
              path="/trash"
              element={<Trash />}
            />

          </Route>

          {/* ==================================================
              STAFF
          ================================================== */}

          <Route
            element={
              <StaffRoute>
                <StaffLayout />
              </StaffRoute>
            }
          >

            {/* ================= STAFF DASHBOARD ================= */}

            <Route
              path="/staff"
              element={<StaffDashboard />}
            />

            {/* ================= MY TASKS ================= */}

            <Route
              path="/staff/tasks"
              element={<StaffTasks />}
            />

            {/* ================= MY ORDERS ================= */}

            <Route
              path="/staff/orders"
              element={<StaffOrders />}
            />

            <Route
              path="/staff/orders/:orderId"
              element={<StaffOrderDetails />}
            />

            {/* ================= STAFF CUSTOMERS ================= */}

            <Route
              path="/staff/customers"
              element={<StaffCustomers />}
            />

            {/* ================= STAFF PROFILE ================= */}

            <Route
              path="/staff/profile"
              element={<StaffProfile />}
            />

          </Route>

          {/* ==================================================
              404
          ================================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
}

export default App;