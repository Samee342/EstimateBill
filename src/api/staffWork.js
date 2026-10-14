import api from "./api";

const assignedWork = async () => {
  const response = await api.get(`/orderslipapi/slipassignworks/`);
  return response.data;
};
export { assignedWork };
