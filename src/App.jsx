import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Home = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/auth/LoginPage"));
const Register = lazy(() => import("./pages/auth/RegisterPage"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const SetupPage = lazy(() => import("./pages/auth/SetupPage"));
const AdminLayout = lazy(() => import("./layout/AdminLayout"));
const ProjectPage = lazy(() => import("./pages/project/AllProject"));
const CreateProject = lazy(() => import("./pages/project/CreateProject"));
const AllCustomers = lazy(() => import("./pages/customers/AllCustomersPage"));
const AddCustomer = lazy(() => import("./pages/customers/AddCustomer"));

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/setup" element={<SetupPage />} />

        {/* Admin Dashboard */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/projects/create-project" element={<CreateProject />} />
          <Route path="/customers" element={<AllCustomers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
