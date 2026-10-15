import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiUsers,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFolder,
  FiEye,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { getCustomer } from "../../api/customer";
import { getProjects } from "../../api/project";

// Update the import path above to match your actual customer API file.

const getCustomerId = (customer) =>
  customer?.uuid || customer?.id || customer?.customer_id || "";

const normalizeCustomer = (customer, index) => {
  const name =
    customer?.name ||
    customer?.customer_name ||
    customer?.full_name ||
    customer?.company_name ||
    "Unnamed Customer";

  const rawStatus = String(
    customer?.status || customer?.customer_status || "Active",
  ).toLowerCase();

  return {
    ...customer,
    id: String(getCustomerId(customer) || `customer-${index + 1}`),
    name,
    phone: String(
      customer?.phone || customer?.contact_no || customer?.mobile || "",
    ),
    email: customer?.email || customer?.email_address || "",
    company: customer?.company || customer?.company_name || "",
    address: customer?.address || customer?.location || customer?.city || "",
    projects: 0,
    status:
      rawStatus === "inactive" || rawStatus === "disabled"
        ? "Inactive"
        : "Active",
  };
};

const extractCustomers = (response) => {
  // Supports common Django REST Framework response formats.
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.customers)) {
    return response.customers;
  }

  if (Array.isArray(response?.data?.results)) {
    return response.data.results;
  }

  return [];
};

const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  // Extract projects regardless of the common API response format.
  const extractProjects = (response) => {
    const data = response?.data?.data ?? response?.data ?? response;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.orders)) return data.orders;
    if (Array.isArray(data?.projects)) return data.projects;

    // Some APIs return one current order and a separate orders array.
    if (data?.current_order) return [data.current_order];

    return [];
  };

  // Extract the actual customer ID from a project/order.
  const getProjectCustomerId = (project) => {
    const customer =
      project?.customer ??
      project?.customer_details ??
      project?.customer_id ??
      project?.order?.customer;

    if (customer && typeof customer === "object") {
      return (
        customer.id ??
        customer.pk ??
        customer.uuid ??
        customer.customer_id ??
        ""
      );
    }

    return customer ?? "";
  };

  // Count projects using the same customer identifier.
  const getCustomerProjectCount = (customer) => {
    const customerIds = [
      customer?.id,
      customer?.pk,
      customer?.customer_id,
      customer?.uuid,
    ]
      .filter((id) => id !== undefined && id !== null && id !== "")
      .map(String);

    return projects.filter((project) => {
      const projectCustomerId = String(getProjectCustomerId(project));

      return (
        projectCustomerId !== "" && customerIds.includes(projectCustomerId)
      );
    }).length;
  };

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Wait for both API calls to finish before calculating counts.
      const [customerResponse, projectResponse] = await Promise.all([
        getCustomer(),
        getProjects(),
      ]);

      const customerList = extractCustomers(customerResponse);
      const projectList = extractProjects(projectResponse);

      setProjects(projectList);

      const normalizedCustomers = customerList.map((customer, index) => {
        const normalized = normalizeCustomer(customer, index);

        const customerIds = [
          customer?.id,
          customer?.pk,
          customer?.customer_id,
          customer?.uuid,
        ]
          .filter((id) => id !== undefined && id !== null && id !== "")
          .map(String);

        const projectCount = projectList.filter((project) => {
          const projectCustomerId = String(getProjectCustomerId(project));

          return (
            projectCustomerId !== "" && customerIds.includes(projectCustomerId)
          );
        }).length;

        return {
          ...normalized,
          projects: projectCount,
        };
      });

      setCustomers(normalizedCustomers);
    } catch (err) {
      console.error("Failed to fetch customers or projects:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load customers and projects. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.name,
        customer.id,
        customer.phone,
        customer.email,
        customer.company,
        customer.address,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [customers, search]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const totalProjects = customers.reduce(
    (total, customer) => total + customer.projects,
    0,
  );

  const openCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            View customer information related to your assigned work.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Customers"
          value={customers.length}
          icon={FiUsers}
          iconClass="bg-orange-50 text-orange-500 dark:bg-orange-500/10"
        />

        <SummaryCard
          title="Active Customers"
          value={activeCustomers}
          icon={FiUsers}
          iconClass="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
        />

        <SummaryCard
          title="Total Projects"
          value={totalProjects}
          icon={FiFolder}
          iconClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customer, phone, company..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/10"
          />
        </div>
      </div>

      {/* CUSTOMER TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Customer List
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {filteredCustomers.length} customer
            {filteredCustomers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FiRefreshCw size={26} className="animate-spin text-orange-500" />

            <p className="mt-4 text-sm text-slate-500">Loading customers...</p>
          </div>
        ) : error ? (
          /* ERROR */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <FiAlertCircle size={30} className="text-red-500" />

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              Failed to load customers
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={fetchCustomers}
              className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FiUsers size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              {search ? "No customers found" : "No customers yet"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try searching with a different name or phone number."
                : "Customers returned by your API will appear here."}
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                    {[
                      "Customer",
                      "Contact",
                      "Address",
                      "Projects",
                      "Status",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      {/* CUSTOMER */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.name} />

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/staff/customers/${encodeURIComponent(customer.id)}`,
                              )
                            }
                            className="group cursor-pointer text-left"
                          >
                            <p className="text-sm font-semibold text-slate-800 transition group-hover:text-orange-500 dark:text-slate-100">
                              {customer.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {customer.id}
                            </p>
                          </button>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <FiPhone size={13} />
                          {customer.phone || "—"}
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                          <FiMail size={13} />
                          {customer.email || "—"}
                        </p>
                      </td>

                      {/* ADDRESS */}
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <FiMapPin size={14} />
                          {customer.address || "—"}
                        </p>
                      </td>

                      {/* PROJECTS */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <FiFolder size={13} />
                          {customer.projects}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <StatusBadge status={customer.status} />
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openCustomerDetails(customer)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <FiEye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={customer.name} />

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900 dark:text-white">
                          {customer.name}
                        </h3>

                        <p className="truncate text-xs text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={customer.status} />
                  </div>

                  <div className="mt-4 space-y-2">
                    <ContactRow icon={FiPhone} value={customer.phone || "—"} />

                    <ContactRow icon={FiMail} value={customer.email || "—"} />

                    <ContactRow
                      icon={FiMapPin}
                      value={customer.address || "—"}
                    />

                    <ContactRow
                      icon={FiFolder}
                      value={`${customer.projects} projects`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => openCustomerDetails(customer)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    <FiEye size={15} />
                    View Customer
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-orange-500">
                  Customer Details
                </p>

                <h2
                  id="customer-modal-title"
                  className="mt-1 font-bold text-slate-900 dark:text-white"
                >
                  {selectedCustomer.name}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close customer details"
                onClick={() => setSelectedCustomer(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="space-y-4 p-5">
              <DetailRow
                icon={FiUsers}
                label="Customer ID"
                value={selectedCustomer.id}
              />

              <DetailRow
                icon={FiPhone}
                label="Phone"
                value={selectedCustomer.phone || "Not provided"}
              />

              <DetailRow
                icon={FiMail}
                label="Email"
                value={selectedCustomer.email || "Not provided"}
              />

              <DetailRow
                icon={FiMapPin}
                label="Address"
                value={selectedCustomer.address || "Not provided"}
              />

              <DetailRow
                icon={FiFolder}
                label="Total Projects"
                value={selectedCustomer.projects}
              />

              <DetailRow
                icon={FiUsers}
                label="Status"
                value={selectedCustomer.status}
              />

              {selectedCustomer.company && (
                <DetailRow
                  icon={FiUsers}
                  label="Company"
                  value={selectedCustomer.company}
                />
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* SUMMARY CARD */
const SummaryCard = ({ title, value, icon: Icon, iconClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400">{title}</p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </h2>
      </div>

      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={20} />
      </div>
    </div>
  </div>
);

/* CUSTOMER AVATAR */
const Avatar = ({ name }) => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
    {name?.charAt(0)?.toUpperCase() || "C"}
  </div>
);

/* STATUS BADGE */
const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
      status === "Active"
        ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
    }`}
  >
    {status}
  </span>
);

/* CONTACT ROW */
const ContactRow = ({ icon: Icon, value }) => (
  <p className="flex min-w-0 items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
    <Icon size={14} className="shrink-0" />
    <span className="break-words">{value}</span>
  </p>
);

/* DETAIL ROW */
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-300">
      <Icon size={16} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-xs text-slate-400">{label}</p>

      <p className="mt-0.5 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  </div>
);

export default StaffCustomers;
