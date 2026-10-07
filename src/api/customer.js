import api from "./api";

const addCustomer = async (data) => {
  const response = await api.post("/customerapi/customers/", data);
  return response.data;
};
const getCustomer = async () => {
  const response = await api.get("/customerapi/customers/");
  return response.data.data;
};
const updateCustomer = async (id, data) => {
  const response = await api.put(`/customersapi/customers/${id}`, data);
  return response.data;
};
const deleteCustomer = async (id) => {
  const response = await api.delete(`/customersapi/customers/${id}`);
  return response.data;
};
export { addCustomer, getCustomer, updateCustomer, deleteCustomer };
