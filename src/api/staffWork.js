import api from "./api";

// Get assigned work for the logged-in staff member
const assignedWork = async () => {
  const response = await api.get("/orderslipapi/slipassignworks/");
  return response.data;
};

// Update one production-stage status
const createAssignedWork = async (id, statusField, statusValue) => {
  const allowedFields = [
    "designing_status",
    "printing_status",
    "binding_status",
  ];

  if (!allowedFields.includes(statusField)) {
    throw new Error("Invalid production status field.");
  }

  const response = await api.patch(`/orderslipapi/slipassignworks/${id}/`, {
    [statusField]: statusValue,
  });

  return response.data;
};

export { assignedWork, createAssignedWork };
