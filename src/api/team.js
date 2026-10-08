import api from "./api";

const createTeam = async (data) => {
  const response = await api.post("/api/staff/", data);
  return response.data;
};
const getTeam = async () => {
  const response = await api.get("/api/staff/");
  return response.data;
};
const updateTeam = async (id, data) => {
  const response = await api.put(`/api/staff/${id}/`, data);
  return response.data;
};
const deleteTeam = async (id) => {
  const response = await api.delete(`/api/staff/${id}/`);
  return response.data;
};
export {createTeam,getTeam,updateTeam,deleteTeam}
