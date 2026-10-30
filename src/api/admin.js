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

// CHANGE PASSWORD
const changePasswordByTenant = async (data) => {
  const response = await api.post("/api/change_password/", data);

  return response.data;
};

const updateProfile = async (data) => {
  const response = await api.patch("/api/me/", data);
  return response.data;
};

const resetDataByAdmin = async () => {
  const response = await api.post("/customerapi/customers/clear");
  return response.data;
};

export {
  createTenant,
  getTenant,
  updateTenant,
  deleteTenant,
  updateProfile,
  changePasswordByTenant,
  resetDataByAdmin,
};
