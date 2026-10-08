import api from "./api";

const createProject = async (data) => {
  const response = await api.post("/orderbillapi/orderslips/", data);
  return response.data;
};
const getProjects = async () => {
  const response = await api.get("/orderbillapi/orderslips/");
  return response.data;
};
const updateProject = async (id, data) => {
  const response = await api.put(`/orderbillapi/orderslips/${id}/`, data);
  return response.data;
};
const deleteProject = async (id) => {
  const response = await api.delete(`/orderbillapi/orderslips/${id}/`);
  return response.data;
};
export { createProject, getProjects, updateProject, deleteProject };
