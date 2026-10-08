import api from "./api";

const createCustomer = async (data) => {
  const response = await api.post("/customerapi/customers/", data);
  return response.data;
};
const getCustomer = async () => {
  const response = await api.get("/customerapi/customers/");
  return response.data;
};
const updateCustomer = async (uuid, data) => {
  const response = await api.put(`/customerapi/customers/${uuid}/`, data);
  return response.data;
};
const deleteCustomer = async (uuid) => {
  const response = await api.delete(`/customerapi/customers/${uuid}/`);
  return response.data;
};
export { createCustomer, getCustomer, updateCustomer, deleteCustomer };
