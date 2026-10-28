import api from "./api";

// ==========================================
// CREATE TENANT
// ==========================================
const createTenant = async (data) => {
  const response = await api.post("/tenantapi/tenants/", data);
  return response.data;
};

// ==========================================
// GET TENANTS
// ==========================================
const getTenant = async () => {
  const response = await api.get("/tenantapi/tenants/");
  return response.data.data;
};

// ==========================================
// UPDATE TENANT
// Pass tenant ID and data separately
// ==========================================
const updateTenant = async (id, data) => {
  if (!id) {
    throw new Error("Tenant ID is missing.");
  }

  const response = await api.patch(`/tenantapi/tenants/${id}/`, data);

  return response.data;
};

// ==========================================
// DELETE TENANT
// ==========================================
const deleteTenant = async (id) => {
  const response = await api.delete(`/tenantapi/tenants/${id}/`);

  return response.data;
};

// ==========================================
// CHANGE PASSWORD
// NOTE: Confirm the required payload keys
// with your Django backend.
// ==========================================
const changePasswordByTenant = async (data) => {
  const response = await api.post("/api/change_password/", data);

  return response.data;
};

export {
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
  changePasswordByTenant,
};
