import api from "./api";

const getOrders = async () => {
  const response = await api.get("/orderslipapi/orderslips/");
  return response.data;
};

const getInvoices = async () => {
  const response = await api.get("/orderslipapi/invoices/");
  return response.data;
};

const getCustomers = async () => {
  const response = await api.get("/customersapi/customers/");
  return response.data;
};
const createInvoice = async (data) => {
  const response = await api.post("/orderslipapi/invoices/", data);
  return response.data;
};

export { getOrders, getInvoices, getCustomers, createInvoice };
