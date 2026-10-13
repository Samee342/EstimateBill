import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiEdit2,
  FiFileText,
  FiMapPin,
  FiSearch,
  FiTrash2,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

import { FaMoneyBillWave } from "react-icons/fa";

import { getProjects } from "../../api/project";
import { getCustomer } from "../../api/customer";

// ======================================================
// HELPERS
// ======================================================

const getRecords = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.customers)) return response.customers;
  if (Array.isArray(response?.orders)) return response.orders;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  if (Array.isArray(response?.data?.customers)) {
    return response.data.customers;
  }
  if (Array.isArray(response?.data?.orders)) return response.data.orders;

  return [];
};

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeStatus = (status) => {
  const value = String(status || "pending").toLowerCase();

  if (value.includes("complete")) return "Completed";
  if (value.includes("print")) return "Printed";

  return "Pending";
};

const statusStyles = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",

  Printed:
    "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

  Completed:
    "border-green-200 bg-green-50 text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
};

// ======================================================
// INFO ITEM
// ======================================================

const InfoItem = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {label}
    </p>

    <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
      {value || "-"}
    </p>
  </div>
);

// ======================================================
// PAGE
// ======================================================

const CustomerDetails = () => {
  const { id, customerId } = useParams();
  const customerParam = id || customerId;

  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ====================================================
  // FETCH CUSTOMER AND PROJECTS SEPARATELY
  // ====================================================

  useEffect(() => {
    let active = true;

    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        setError("");
        setCustomer(null);
        setOrders([]);

        // Customer lookup uses the customer API.
        // Project history comes from the orders API.
        const [customerResponse, projectResponse] = await Promise.all([
          getCustomer(),
          getProjects(),
        ]);

        if (!active) return;

        const customerList = getRecords(customerResponse);
        const projectList = getRecords(projectResponse);

        // AllCustomers navigates using customer.uuid.
        // Therefore, find the customer by UUID first.
        const matchedCustomer = customerList.find(
          (item) =>
            String(item.uuid) === String(customerParam) ||
            String(item.id) === String(customerParam),
        );

        if (!matchedCustomer) {
          setCustomer(null);
          setOrders(projectList);

          setError(
            `No customer with ID ${customerParam} was found in the customer list.`,
          );

          return;
        }

        setCustomer(matchedCustomer);
        setOrders(projectList);
      } catch (err) {
        console.error("Failed to fetch customer details:", err);

        if (active) {
          setError(
            err.response?.data?.detail ||
              err.response?.data?.message ||
              "Unable to load customer information. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (customerParam) {
      fetchCustomerDetails();
    } else {
      setError("Customer ID is missing from the URL.");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [customerParam]);

  // ====================================================
  // FIND THIS CUSTOMER'S PROJECTS
  // ====================================================

  const customerOrders = useMemo(() => {
    if (!customer) return [];

    return orders.filter((order) => {
      const orderCustomerId = order.customer_details?.id ?? order.customer;

      const orderCustomerUuid =
        order.customer_details?.uuid ?? order.customer_uuid;

      // The order's customer field is usually the numeric database ID.
      // UUID matching is also supported if the backend returns it.
      return (
        String(orderCustomerId) === String(customer.id) ||
        (customer.uuid && String(orderCustomerUuid) === String(customer.uuid))
      );
    });
  }, [orders, customer]);

  // ====================================================
  // PREPARE CUSTOMER AND PROJECT DATA
  // ====================================================

  const customerData = useMemo(() => {
    if (!customer) return null;

    return {
      id: customer.id,
      uuid: customer.uuid,
      name: customer.name || "Unnamed Customer",

      phone:
        customer.contact_no || customer.phone || customer.phone_number || "-",

      email: customer.email || "-",

      pan: customer.pan_no || customer.pan || customer.pan_number || "-",

      address: customer.address || "-",
      status: customer.status || "Active",

      projects: customerOrders.map((order) => ({
        id: order.id,
        slipNo: order.slip_no,
        name: order.project_name || `Order #${order.slip_no ?? order.id}`,
        date: order.slip_date,
        dueDate: order.delivery_date,
        amount: Number(order.total_amount || 0),
        paidAmount: Number(order.paid_amount || 0),
        balance: Number(order.balance || 0),
        status: normalizeStatus(order.work_stage),
      })),
    };
  }, [customer, customerOrders]);

  // ====================================================
  // FILTER PROJECTS
  // ====================================================

  const filteredProjects = useMemo(() => {
    if (!customerData) return [];

    const searchValue = search.toLowerCase().trim();

    return customerData.projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchValue) ||
        String(project.slipNo ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        String(project.id).toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customerData, search, statusFilter]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading customer information...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // API ERROR OR CUSTOMER NOT FOUND
  // ====================================================

  if (error || !customerData) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 dark:text-slate-400"
          >
            <FiArrowLeft size={17} />
            Back to Customers
          </button>

          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <FiUser size={24} />
            </div>

            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              {error && error.includes("No customer")
                ? "Customer Not Found"
                : "Could Not Load Customer"}
            </h1>

            <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
              {error || "This customer could not be found."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // REAL CALCULATIONS
  // ====================================================

  const totalProjects = customerData.projects.length;

  const totalBusiness = customerData.projects.reduce(
    (total, project) => total + project.amount,
    0,
  );

  const paidAmount = customerData.projects.reduce(
    (total, project) => total + project.paidAmount,
    0,
  );

  const remainingAmount = customerData.projects.reduce(
    (total, project) => total + project.balance,
    0,
  );

  // ====================================================
  // PAGE UI
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* CUSTOMER HEADER */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl font-bold text-orange-500 dark:bg-orange-500/10">
                {customerData.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {customerData.name}
                  </h1>

                  <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                    {customerData.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">
                    {customerData.uuid || customerData.id}
                  </span>

                  <span>•</span>

                  <span>{customerData.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/customers/${customerData.uuid || customerData.id}/edit`,
                  )
                }
                className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-slate-300 dark:hover:bg-orange-500/20"
              >
                <FiEdit2 size={16} />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  window.alert(
                    "Customer deletion is not connected yet. Connect your customer DELETE API before deleting records.",
                  )
                }
                className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
              >
                <FiTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Projects",
              value: totalProjects,
              icon: <FiBriefcase size={18} />,
              color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
            },
            {
              label: "Total Business",
              value: formatCurrency(totalBusiness),
              icon: <FaMoneyBillWave size={18} />,
              color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
            },
            {
              label: "Paid Amount",
              value: formatCurrency(paidAmount),
              icon: <FaMoneyBillWave size={18} />,
              color: "text-green-600 bg-green-50 dark:bg-green-500/10",
            },
            {
              label: "Remaining",
              value: formatCurrency(remainingAmount),
              icon: <FaMoneyBillWave size={18} />,
              color: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>

                  <h2 className="mt-2 break-words text-2xl font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                >
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* CUSTOMER INFORMATION */}

          <div className="lg:col-span-1">
            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                  <FiUser size={17} />
                </div>

                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-5">
                <InfoItem label="Customer Name" value={customerData.name} />

                <InfoItem
                  label="Customer ID"
                  value={customerData.uuid || customerData.id}
                />

                <InfoItem label="Phone" value={customerData.phone} />

                <InfoItem label="Email" value={customerData.email} />

                <InfoItem label="PAN / VAT Number" value={customerData.pan} />

                <InfoItem label="Address" value={customerData.address} />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex items-start gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <FiMapPin className="mt-0.5 shrink-0" size={16} />
                  <span>{customerData.address}</span>
                </div>
              </div>
            </section>

            {/* PAYMENT SUMMARY */}

            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                  <FaMoneyBillWave size={16} />
                </div>

                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Payment Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total Business
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(totalBusiness)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Paid
                  </span>

                  <span className="text-right text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Remaining
                    </span>

                    <span className="text-right text-base font-bold text-orange-500">
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* PROJECT HISTORY */}

          <div className="lg:col-span-2">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                        <FiFileText size={17} />
                      </div>

                      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        Project History
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                      Orders and projects created for this customer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/projects/create-project", {
                        state: {
                          // Use the database ID for the order's customer FK.
                          customerId: customerData.id,
                          customerUuid: customerData.uuid,
                        },
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Create Project
                  </button>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <FiSearch
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Printed">Printed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="group flex w-full flex-col gap-4 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 last:border-b-0 dark:border-slate-800 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                          <FiFileText size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {project.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>
                              {project.slipNo != null
                                ? `Slip #${project.slipNo}`
                                : `Order ${String(project.id).slice(0, 8)}`}
                            </span>

                            <span>•</span>

                            <span>{formatDate(project.date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {formatCurrency(project.amount)}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400 sm:justify-end">
                            <FiCalendar size={12} />
                            Due {formatDate(project.dueDate)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                            statusStyles[project.status]
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-16 text-center">
                    <FiFileText
                      size={40}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                      No projects found
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {customerData.projects.length === 0
                        ? "This customer does not have any projects yet."
                        : "Try changing your search or status filter."}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
