import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiUsers,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
} from "react-icons/fi";
import { MdOutlineReceipt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import RecordPaymentModal from "../../modal/RecordPaymentModal";
import { getOrders, getInvoices } from "./../../api/payment";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const getList = (response) => {
  const data = response?.data?.data ?? response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.invoices)) return data.invoices;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (amount) =>
  `Rs. ${toNumber(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "-";
  const dateOnly = String(date).split("T")[0];
  const [y, m, d] = dateOnly.split("-");
  if (!y || !m || !d) return "-";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const idx = Number(m) - 1;
  if (idx < 0 || idx > 11) return "-";
  return `${d} ${months[idx]} ${y}`;
};

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

const CustomerPayments = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentCustomer, setPaymentCustomer] = useState(null);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [ordersResponse, invoicesResponse] = await Promise.all([
        getOrders(),
        getInvoices(),
      ]);

      setOrders(getList(ordersResponse));
      setInvoices(getList(invoicesResponse));
    } catch (error) {
      console.error("Failed to load payment data:", error);
      toast.error("Unable to load payment data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --------------------------------------------------
  // BUILD PER-CUSTOMER SUMMARY
  // --------------------------------------------------

  const customerSummaries = useMemo(() => {
    const map = new Map();

    const ensure = (customerId, customerDetails) => {
      if (!map.has(customerId)) {
        map.set(customerId, {
          customerId,
          name: customerDetails?.name ?? "Unknown customer",
          contact: customerDetails?.contact_no ?? "",
          address: customerDetails?.address ?? "",
          pan: customerDetails?.pan_no ?? "",
          orders: [],
          totalBilled: 0,
          totalPaid: 0,
          totalOutstanding: 0,
          invoiceCount: 0,
          lastPaymentDate: null,
        });
      }
      return map.get(customerId);
    };

    // 1. Add all orders
    orders.forEach((order) => {
      const customerId = order?.customer;
      if (customerId === null || customerId === undefined) return;

      const entry = ensure(customerId, order?.customer_details);
      const total = toNumber(
        order?.total_amount ??
          order?.current_order?.total_amount ??
          order?.grand_total,
      );

      entry.totalBilled += total;

      entry.orders.push({
        id: order?.id,
        slip_no: order?.slip_no,
        project_name: order?.project_name ?? order?.name,
        slip_date: order?.slip_date,
        delivery_date: order?.delivery_date,
        total,
        // `paid` and `balance` will be computed from invoices below
        paid: 0,
        balance: total,
        work_stage: order?.work_stage ?? order?.work_status ?? order?.status,
        invoices: [],
      });
    });

    // 2. Attach invoices to the right order + customer
    invoices.forEach((inv) => {
      const orderId = inv?.order;
      if (orderId === null || orderId === undefined) return;

      let target = null;
      for (const entry of map.values()) {
        const found = entry.orders.find(
          (o) => String(o.id) === String(orderId),
        );
        if (found) {
          target = { entry, order: found };
          break;
        }
      }
      if (!target) return;

      const amount = toNumber(inv?.amount);

      target.order.invoices.push({
        id: inv?.id,
        amount,
        status: inv?.status ?? "pending",
        payment_method: inv?.payment_method ?? "",
        paid_date: inv?.paid_date ?? inv?.created_at,
      });

      target.entry.invoiceCount += 1;

      const paidDate = inv?.paid_date ?? inv?.created_at;
      if (paidDate) {
        const current = target.entry.lastPaymentDate;
        if (!current || new Date(paidDate) > new Date(current)) {
          target.entry.lastPaymentDate = paidDate;
        }
      }
    });

    // 3. Compute per-order paid/balance from invoices, then customer totals
    return Array.from(map.values()).map((entry) => {
      let customerPaid = 0;
      let customerBilled = 0;

      entry.orders = entry.orders.map((order) => {
        const paidFromInvoices = order.invoices.reduce(
          (sum, inv) => sum + toNumber(inv.amount),
          0,
        );

        const balance = Math.max(order.total - paidFromInvoices, 0);

        customerPaid += paidFromInvoices;
        customerBilled += order.total;

        return {
          ...order,
          paid: paidFromInvoices,
          balance,
        };
      });

      const outstanding = Math.max(customerBilled - customerPaid, 0);

      let status = "Paid";
      if (customerBilled === 0) {
        status = "No Orders";
      } else if (outstanding <= 0.01) {
        status = "Paid";
      } else if (customerPaid > 0) {
        status = "Partial";
      } else {
        status = "Credit";
      }

      return {
        ...entry,
        totalBilled: customerBilled,
        totalPaid: customerPaid,
        totalOutstanding: outstanding,
        status,
      };
    });
  }, [orders, invoices]);

  // --------------------------------------------------
  // FILTERS
  // --------------------------------------------------

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return customerSummaries
      .filter((c) => {
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.contact.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.pan.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "All" || c.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => b.totalOutstanding - a.totalOutstanding);
  }, [customerSummaries, search, statusFilter]);

  // --------------------------------------------------
  // SUMMARY TOTALS
  // --------------------------------------------------

  const totals = useMemo(() => {
    return customerSummaries.reduce(
      (acc, c) => {
        acc.billed += c.totalBilled;
        acc.paid += c.totalPaid;
        acc.outstanding += c.totalOutstanding;
        if (c.status === "Credit") acc.creditCount += 1;
        if (c.status === "Paid") acc.paidCount += 1;
        return acc;
      },
      {
        billed: 0,
        paid: 0,
        outstanding: 0,
        creditCount: 0,
        paidCount: 0,
      },
    );
  }, [customerSummaries]);

  // --------------------------------------------------
  // STATUS STYLING
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";
      case "Partial":
        return "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
      case "Credit":
        return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  // --------------------------------------------------
  // OPEN PAYMENT MODAL
  // --------------------------------------------------

  const handleRecordPayment = (customer) => {
    setPaymentCustomer(customer);
    setPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
    setPaymentCustomer(null);
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 text-slate-800 dark:bg-slate-700 dark:text-slate-200 sm:p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Customer Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track every customer's payments, credit status, and outstanding
            dues.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <MdOutlineReceipt size={17} />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Billed"
          value={formatMoney(totals.billed)}
          icon={<FiFileText size={20} />}
          iconClass="bg-blue-50 text-blue-500 dark:bg-blue-500/10"
        />
        <SummaryCard
          label="Total Paid"
          value={formatMoney(totals.paid)}
          icon={<FiCheckCircle size={20} />}
          iconClass="bg-green-50 text-green-500 dark:bg-green-500/10"
        />
        <SummaryCard
          label="Total Outstanding"
          value={formatMoney(totals.outstanding)}
          icon={<FiDollarSign size={20} />}
          iconClass="bg-orange-50 text-orange-500 dark:bg-orange-500/10"
        />
        <SummaryCard
          label="Customers in Credit"
          value={totals.creditCount}
          icon={<FiAlertCircle size={20} />}
          iconClass="bg-red-50 text-red-500 dark:bg-red-500/10"
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search customer, phone, PAN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex w-full items-center gap-2 lg:w-auto">
            <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 lg:w-44 lg:flex-none"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Credit">In Credit</option>
              <option value="No Orders">No Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* CUSTOMER LIST */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl">
        <div className="border-b border-slate-200 p-5 dark:border-slate-600 sm:p-7">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
            Customer Balances
          </h3>
          <p className="mt-1.5 text-sm text-slate-400">
            {loading
              ? "Loading..."
              : `${filtered.length} customer${filtered.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-slate-500">
            <FiLoader className="animate-spin" size={20} />
            Loading payments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-20 text-center">
            <FiUsers
              size={42}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />
            <h3 className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-200">
              No customers found
            </h3>
            <p className="mt-1.5 text-sm text-slate-400">
              {customerSummaries.length === 0
                ? "There are no orders or payments yet."
                : "Try changing your search or status filter."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.map((customer) => {
              const isOpen = expandedCustomer === customer.customerId;

              return (
                <div key={customer.customerId}>
                  {/* ROW */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCustomer(isOpen ? null : customer.customerId)
                    }
                    className="flex w-full items-center gap-5 px-5 py-6 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700 sm:px-7"
                  >
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-base font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {(customer.name || "?").charAt(0).toUpperCase()}
                    </div>

                    {/* Name + contact */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-slate-800 dark:text-slate-100">
                        {customer.name}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {customer.contact || "No contact"} ·{" "}
                        {customer.orders.length} order
                        {customer.orders.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    {/* Amounts (desktop) */}
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-sm text-slate-400">Billed</p>
                      <p className="mt-0.5 text-base font-semibold text-slate-700 dark:text-slate-200">
                        {formatMoney(customer.totalBilled)}
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-sm text-slate-400">Paid</p>
                      <p className="mt-0.5 text-base font-semibold text-green-600 dark:text-green-400">
                        {formatMoney(customer.totalPaid)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm text-slate-400">Outstanding</p>
                      <p className="mt-0.5 text-base font-semibold text-orange-600 dark:text-orange-400">
                        {formatMoney(customer.totalOutstanding)}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`hidden shrink-0 rounded-full px-4 py-2 text-sm font-semibold sm:inline-block ${getStatusStyle(
                        customer.status,
                      )}`}
                    >
                      {customer.status}
                    </span>

                    {/* Chevron */}
                    <span className="shrink-0 text-slate-400">
                      {isOpen ? (
                        <FiChevronUp size={22} />
                      ) : (
                        <FiChevronDown size={22} />
                      )}
                    </span>
                  </button>

                  {/* EXPANDED DETAILS */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50 px-5 py-6 dark:border-slate-700 dark:bg-slate-800/50 sm:px-7 sm:py-7">
                      {/* Customer meta */}
                      <div className="mb-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-slate-400">Phone</p>
                          <p className="mt-1 text-base font-medium text-slate-700 dark:text-slate-200">
                            {customer.contact || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">PAN / VAT</p>
                          <p className="mt-1 text-base font-medium text-slate-700 dark:text-slate-200">
                            {customer.pan || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Address</p>
                          <p className="mt-1 text-base font-medium text-slate-700 dark:text-slate-200">
                            {customer.address || "-"}
                          </p>
                        </div>
                      </div>

                      {/* Orders */}
                      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800">
                        <table className="w-full text-left text-sm">
                          <thead className="border-b border-slate-100 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-700">
                            <tr>
                              <th className="px-4 py-3.5 font-semibold">
                                Slip
                              </th>
                              <th className="px-4 py-3.5 font-semibold">
                                Project
                              </th>
                              <th className="hidden px-4 py-3.5 font-semibold sm:table-cell">
                                Date
                              </th>
                              <th className="px-4 py-3.5 text-right font-semibold">
                                Total
                              </th>
                              <th className="px-4 py-3.5 text-right font-semibold">
                                Paid
                              </th>
                              <th className="px-4 py-3.5 text-right font-semibold">
                                Due
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.orders.map((order) => (
                              <tr
                                key={order.id}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                              >
                                <td className="px-4 py-3.5 font-semibold text-orange-600 dark:text-orange-400">
                                  #{order.slip_no ?? "-"}
                                </td>
                                <td className="px-4 py-3.5 text-slate-700 dark:text-slate-200">
                                  {order.project_name || "-"}
                                </td>
                                <td className="hidden px-4 py-3.5 text-slate-500 sm:table-cell">
                                  {formatDate(order.slip_date)}
                                </td>
                                <td className="px-4 py-3.5 text-right font-semibold text-slate-700 dark:text-slate-200">
                                  {formatMoney(order.total)}
                                </td>
                                <td className="px-4 py-3.5 text-right text-green-600 dark:text-green-400">
                                  {formatMoney(order.paid)}
                                </td>
                                <td className="px-4 py-3.5 text-right font-semibold text-orange-600 dark:text-orange-400">
                                  {formatMoney(order.balance)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleRecordPayment(customer)}
                          disabled={customer.totalOutstanding <= 0}
                          className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Record Payment
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/customers/${customer.customerId}`)
                          }
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          View Customer
                        </button>

                        <button
                          type="button"
                          onClick={() => navigate("/projects")}
                          className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-600 transition hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400"
                        >
                          View All Projects
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECORD PAYMENT MODAL */}
      <RecordPaymentModal
        isOpen={paymentModalOpen}
        onClose={handlePaymentModalClose}
        customer={paymentCustomer}
        onSaved={loadData}
      />
    </div>
  );
};

// --------------------------------------------------
// SUMMARY CARD
// --------------------------------------------------

const SummaryCard = ({ label, value, icon, iconClass }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-800 sm:rounded-2xl sm:p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          {label}
        </p>
        <h3 className="mt-1 break-words text-xl font-bold text-slate-900 dark:text-slate-100 sm:mt-2 sm:text-2xl">
          {value}
        </h3>
      </div>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11 sm:rounded-xl ${iconClass}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default CustomerPayments;
