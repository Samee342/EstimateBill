import api from "./api";

const createTenant = async (data) => {
  const response = await api.post("/tenantapi/tenants/", data);
  return response.data;
};
const getTenant = async () => {
  const response = await api.get("/tenantapi/tenants");
  return response.data.data;
};
const updateTenant = async (id, data) => {
  const response = await api.put(`/tenantapi/tenants/${id}`, data);
  return response.data;
};
const deleteTenant = async (id) => {
  const response = await api.delete(`/tenatapi/tenants/${id}`);
  return response.data;
};
export { createTenant, getTenant, updateTenant, deleteTenant };
