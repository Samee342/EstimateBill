import React, { useEffect, useMemo, useState } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiClock,
  FiSearch,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCustomer } from "../../../api/customer";
import { getProjects } from "../../../api/project";

// ========================================
// HELPERS
// ========================================

const getRecords = (response) => {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.customers)) return response.customers;
  if (Array.isArray(response?.orders)) return response.orders;

  return [];
};

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const parseDate = (date) => {
  if (!date) return null;

  const datePart = String(date).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) return null;

  const parsed = new Date(year, month - 1, day);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDate = (date) => {
  const parsed = parseDate(date);

  if (!parsed) return "—";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === "string") return data;
  if (data?.detail) return data.detail;
  if (data?.message) return data.message;

  return error.message || "Unable to load customer report.";
};

const getCustomerStatus = (projects) => {
  return projects.length > 0 ? "Active" : "No Orders";
};

// ========================================
// CUSTOMER REPORT
// ========================================

const CustomerReport = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH REAL CUSTOMERS AND PROJECTS
  // ========================================

  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");

        const [customerResponse, projectResponse] = await Promise.all([
          getCustomer(),
          getProjects(),
        ]);

        const customerRecords = getRecords(customerResponse);
        const projectRecords = getRecords(projectResponse);

        console.log("[CUSTOMER REPORT] Customers:", customerRecords);
        console.log("[CUSTOMER REPORT] Projects:", projectRecords);

        const mappedCustomers = customerRecords.map((customer) => {
          // Match orders using the customer ID returned by the API.
          const customerProjects = projectRecords.filter(
            (project) => String(project.customer) === String(customer.id),
          );

          const totalAmount = customerProjects.reduce(
            (total, project) => total + (Number(project.total_amount) || 0),
            0,
          );

          const paid = customerProjects.reduce(
            (total, project) => total + (Number(project.paid_amount) || 0),
            0,
          );

          const due = customerProjects.reduce((total, project) => {
            if (
              project.balance !== null &&
              project.balance !== undefined &&
              project.balance !== ""
            ) {
              return total + Math.max(Number(project.balance) || 0, 0);
            }

            const amount = Number(project.total_amount) || 0;
            const received = Number(project.paid_amount) || 0;

            return total + Math.max(amount - received, 0);
          }, 0);

          const sortedProjects = [...customerProjects].sort((a, b) => {
            const dateA =
              parseDate(a.slip_date || a.created_at)?.getTime() || 0;
            const dateB =
              parseDate(b.slip_date || b.created_at)?.getTime() || 0;

            return dateB - dateA;
          });

          const latestOrder = sortedProjects[0];

          return {
            id: customer.id,
            createdAt: customer.created_at,
            displayId: `CUS-${String(customer.id).padStart(4, "0")}`,
            name: customer.name || customer.company_name || "Unnamed Customer",
            phone: customer.contact_no || "—",
            projects: customerProjects.length,
            totalAmount,
            paid,
            due,
            lastOrder: latestOrder
              ? latestOrder.slip_date || latestOrder.created_at
              : null,
            status: getCustomerStatus(customerProjects),
          };
        });

        if (isMounted) {
          setCustomers(mappedCustomers);
        }
      } catch (err) {
        console.error("[CUSTOMER REPORT] Failed to load:", err);
        console.error(
          "[CUSTOMER REPORT] Backend response:",
          err.response?.data,
        );

        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, []);

  // ========================================
  // SEARCH
  // ========================================

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.displayId.toLowerCase().includes(query) ||
        String(customer.id).toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query),
    );
  }, [customers, search]);

  // ========================================
  // SUMMARY TOTALS
  // ========================================

  const totalBusiness = customers.reduce(
    (total, customer) => total + customer.totalAmount,
    0,
  );

  const totalPaid = customers.reduce(
    (total, customer) => total + customer.paid,
    0,
  );

  const totalDue = customers.reduce(
    (total, customer) => total + customer.due,
    0,
  );

  // Customers created during the current calendar month.
  const newCustomers = customers.filter((customer) => {
    // Customer creation date is fetched separately below if available.
    return customer.createdAt
      ? (() => {
          const date = parseDate(customer.createdAt);
          const now = new Date();

          return (
            date &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        })()
      : false;
  }).length;

  const paymentPercentage =
    totalBusiness > 0 ? Math.min((totalPaid / totalBusiness) * 100, 100) : 0;

  // ========================================
  // EXPORT CSV
  // ========================================

  const handleExport = () => {
    if (filteredCustomers.length === 0) return;

    const headers = [
      "Customer ID",
      "Customer Name",
      "Phone",
      "Projects",
      "Total Business",
      "Paid",
      "Due",
      "Last Order",
      "Status",
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.displayId,
      customer.name,
      customer.phone,
      customer.projects,
      customer.totalAmount,
      customer.paid,
      customer.due,
      formatDate(customer.lastOrder),
      customer.status,
    ]);

    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "printtech-customer-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ========================================
  // CUSTOMER ROW / CARD
  // ========================================

  const openCustomer = (id) => {
    navigate(`/customers/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white px-5 py-5 dark:border-slate-700 dark:bg-slate-800 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-orange-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Reports
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Customer Report
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View customer-wise printing business and outstanding amounts.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={loading || filteredCustomers.length === 0}
            className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiDownload size={17} />
            Export Report
          </button>
        </div>
      </header>

      <main className="p-5 md:p-8">
        {/* LOADING */}

        {loading && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-orange-100 bg-white p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            Loading customer report...
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Unable to load customer report
            </p>

            <p className="mt-1 break-words text-sm text-red-600 dark:text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-semibold text-red-700 underline dark:text-red-400"
            >
              Try again
            </button>
          </div>
        )}

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="relative w-full md:max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search customer name, ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:focus:bg-slate-700"
            />
          </div>

          {!loading && !error && (
            <p className="mt-3 text-xs text-slate-400">
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
          )}
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Customers
                </p>
                <h3 className="mt-2 text-2xl font-bold dark:text-slate-100">
                  {loading ? "—" : customers.length.toLocaleString("en-IN")}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-500/10">
                <FiUsers size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  New Customers
                </p>
                <h3 className="mt-2 text-2xl font-bold dark:text-slate-100">
                  {loading ? "—" : newCustomers}
                </h3>
                <p className="mt-1 text-xs text-slate-400">Added this month</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10">
                <FiUserPlus size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Customer Business
                </p>
                <h3 className="mt-2 break-words text-xl font-bold dark:text-slate-100">
                  {loading ? "—" : formatCurrency(totalBusiness)}
                </h3>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FaMoneyBillWave size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Total Due
                </p>
                <h3 className="mt-2 break-words text-xl font-bold text-red-500">
                  {loading ? "—" : formatCurrency(totalDue)}
                </h3>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10">
                <FiClock size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER TABLE */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-6 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Customer-wise Report
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Printing projects and payment summary by customer
            </p>
          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-700">
                  {[
                    "Customer",
                    "Projects",
                    "Total Business",
                    "Paid",
                    "Due",
                    "Last Order",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-6 py-4 text-xs uppercase text-slate-400"
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
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
                  >
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => openCustomer(customer.id)}
                        className="flex items-center gap-3 text-left"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600 dark:bg-orange-500/10">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 transition hover:text-orange-500 dark:text-slate-200">
                            {customer.name}
                          </p>
                          <p className="mt-1 text-xs text-orange-500">
                            {customer.displayId}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {customer.phone}
                          </p>
                        </div>
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm dark:text-slate-300">
                        <FiFileText className="text-slate-400" />
                        {customer.projects}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold dark:text-slate-300">
                      {formatCurrency(customer.totalAmount)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(customer.paid)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-red-500">
                      {formatCurrency(customer.due)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(customer.lastOrder)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                          customer.status === "Active"
                            ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredCustomers.map((customer) => (
              <button
                type="button"
                key={customer.id}
                onClick={() => openCustomer(customer.id)}
                className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-300 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-600 dark:bg-orange-500/10">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {customer.name}
                      </p>
                      <p className="mt-1 text-xs text-orange-500">
                        {customer.displayId}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {customer.phone}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      customer.status === "Active"
                        ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Projects</p>
                    <p className="mt-1 text-sm font-semibold dark:text-slate-200">
                      {customer.projects}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Total Business</p>
                    <p className="mt-1 break-words text-sm font-semibold dark:text-slate-200">
                      {formatCurrency(customer.totalAmount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Paid</p>
                    <p className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(customer.paid)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Due</p>
                    <p className="mt-1 text-sm font-semibold text-red-500">
                      {formatCurrency(customer.due)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Last Order</p>
                    <p className="mt-1 text-sm dark:text-slate-300">
                      {formatDate(customer.lastOrder)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* NO RESULTS */}

          {!loading && !error && filteredCustomers.length === 0 && (
            <div className="p-10 text-center">
              <FiSearch className="mx-auto text-2xl text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-300">
                No customers found.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Try searching with another name, ID or phone number.
              </p>
            </div>
          )}
        </div>

        {/* PAYMENT SUMMARY */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            Payment Summary
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Received payments compared with total customer business
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${paymentPercentage}%` }}
            />
          </div>

          <div className="mt-3 flex flex-col justify-between gap-2 text-xs sm:flex-row">
            <span className="text-green-600 dark:text-green-400">
              Paid: {formatCurrency(totalPaid)}
            </span>

            <span className="text-red-500">
              Due: {formatCurrency(totalDue)}
            </span>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {paymentPercentage.toFixed(1)}% of total business received
          </p>
        </div>
      </main>
    </div>
  );
};

export default CustomerReport;
