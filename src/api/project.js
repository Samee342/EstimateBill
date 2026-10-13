import api from "./api";

const createProject = async (data) => {
  const response = await api.post("/orderslipapi/orderslips/", data);
  return response.data;
};

const getProjects = async () => {
  const response = await api.get("/orderslipapi/orderslips/");
  return response.data;
};

const updateProject = async (id, data) => {
  const response = await api.patch(`/orderslipapi/orderslips/${id}/`, data);
  return response.data;
};

const deleteProject = async (id) => {
  const response = await api.delete(`/orderslipapi/orderslips/${id}/`);
  return response.data;
};
const addItems = async (data) => {
  const response = await api.post("/orderslipapi/slipitems/", data);
  return response.data;
};
const createAmount = async (data) => {
  const response = await api.post(`/orderslipapi/invoices/`, data);
  return response.data;
};
const getPaymentStatus = async () => {
  const response = await api.get(`/orderslipapi/invoices`);
  return response.data;
};

export {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  addItems,
  createAmount,
  getPaymentStatus,
};
