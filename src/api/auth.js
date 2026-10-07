import api from "./api";

const Login = async (data) => {
  const response = await api.post("/api/login/", data);
  return response.data;
};

const Register = async (data) => {
  const response = await api.post("/api/register/", data);
  return response.data;
};
const ForgotPassword = async (data) => {
  const response = await api.post("/api/forgot-password/", data);
  return response.data;
};
const ResetPassword = async (data) => {
  const response = await api.post("/api/reset-password/", data);
  return response.data;
};

export { Login, Register, ForgotPassword, ResetPassword };
