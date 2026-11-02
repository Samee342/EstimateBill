import api from "./api";

const createCustomer = async (data) => {
  const response = await api.post("/customerapi/customers/", data);
  return response.data;
};

// Fetch all customers
const getCustomer = async () => {
  const response = await api.get("/customerapi/customers/");
  return response.data;
};

// Fetch one customer by UUID
const getCustomerById = async (uuid) => {
  const response = await api.get(`/customerapi/customers/${uuid}/`);
  return response.data;
};

// Update customer
const updateCustomer = async (uuid, data) => {
  const response = await api.put(`/customerapi/customers/${uuid}/`, data);
  return response.data;
};

// Delete customer
const deleteCustomer = async (uuid) => {
  const response = await api.delete(`/customerapi/customers/${uuid}/`);
  return response.data;
};

export {
  createCustomer,
  getCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
