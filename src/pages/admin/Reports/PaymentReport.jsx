import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiDownload,
  FiCreditCard,
  FiCalendar,
  FiRefreshCw,
  FiSmartphone,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getProjects, getPaymentStatus } from "../../../api/project";

// Pasal ID you provided
const PASAL_ID = "65d16227-4f26-4614-b943-ae378f1ca61f";

const PaymentReport = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toNumber = (value) => {
    if (value === null || value === undefined || value === "") return 0;

    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const formatAmount = (value) =>
    `Rs. ${toNumber(value).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const extractRecords = (response) => {
    let data = response?.data ?? response;

    for (let i = 0; i < 5 && data && !Array.isArray(data); i += 1) {
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.orders)) return data.orders;
      if (Array.isArray(data.invoices)) return data.invoices;
      if (Array.isArray(data.payments)) return data.payments;
      if (Array.isArray(data.data)) return data.data;

      if (data.data && typeof data.data === "object") {
        data = data.data;
        continue;
      }

      if (data.current_order && typeof data.current_order === "object") {
        return [data.current_order];
      }

      break;
    }

    if (Array.isArray(data)) return data;

    if (data && typeof data === "object" && data.id) {
      return [data];
    }

    return [];
  };

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResponse, paymentResponse] = await Promise.all([
        getProjects(),
        getPaymentStatus(),
      ]);

      console.log("Payment report orders:", ordersResponse);
      console.log("Payment report invoices:", paymentResponse);

      const orderRecords = extractRecords(ordersResponse);
      const invoiceRecords = extractRecords(paymentResponse);

      console.log("Extracted orders:", orderRecords);
      console.log("Extracted payment records:", invoiceRecords);

      setOrders(orderRecords);
      setPaymentRecords(invoiceRecords);

      if (orderRecords.length === 0 && invoiceRecords.length === 0) {
        setError("No orders or invoice/payment records were returned.");
      }
    } catch (err) {
      console.error("Failed to load payment report:", err);
      console.error("API error:", err?.response?.data);

      setOrders([]);
      setPaymentRecords([]);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load payment report.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getCustomerName = (order) => {
    const customer = order?.customer_details ?? order?.customer_info;

    if (typeof customer === "string") return customer;

    return (
      customer?.name ||
      customer?.customer_name ||
      order?.customer_name ||
      order?.client_name ||
      (order?.customer != null
        ? `Customer #${order.customer}`
        : "Unknown customer")
    );
  };

  const getInvoiceNumber = (order) => {
    const value =
      order?.invoice_number ??
      order?.invoice_no ??
      order?.invoice?.invoice_number ??
      order?.slip_no ??
      order?.order_number ??
      order?.id;

    return value != null ? String(value) : "—";
  };

  const getProjectName = (order) =>
    order?.project_name ||
    order?.title ||
    order?.order_name ||
    order?.description ||
    "Printing order";

  const getOrderDate = (order) =>
    order?.slip_date ||
    order?.invoice_date ||
    order?.created_at ||
    order?.order_date ||
    order?.date ||
    "";

  // Extract Pasal ID from the order if the API provides it.
  const getPasalId = (order) => {
    const pasal =
      order?.pasal ??
      order?.pasal_id ??
      order?.pasal_details ??
      order?.shop ??
      order?.shop_id;

    if (typeof pasal === "string" || typeof pasal === "number") {
      return String(pasal);
    }

    if (pasal && typeof pasal === "object") {
      return pasal.id != null
        ? String(pasal.id)
        : pasal.uuid != null
          ? String(pasal.uuid)
          : PASAL_ID;
    }

    return PASAL_ID;
  };

  const getPaymentMethod = (record) =>
    record?.payment_method_display ||
    record?.payment_method ||
    record?.payment_mode_display ||
    record?.payment_mode ||
    record?.method ||
    record?.mode ||
    record?.payment_type ||
    record?.payment_method_name ||
    record?.transaction_method ||
    "";

  const getRecordPaidAmount = (record) =>
    toNumber(
      record?.paid_amount ??
        record?.amount_paid ??
        record?.payment_amount ??
        record?.amount_received ??
        record?.advance_amount ??
        record?.amount ??
        record?.payment ??
        0,
    );

  const payments = useMemo(() => {
    return orders.map((order, index) => {
      const amount = Math.max(
        0,
        toNumber(
          order?.total_amount ??
            order?.grand_total ??
            order?.total ??
            order?.amount,
        ),
      );

      const paid = Math.min(
        amount,
        Math.max(
          0,
          toNumber(
            order?.paid_amount ??
              order?.amount_paid ??
              (order?.balance !== undefined
                ? amount - toNumber(order.balance)
                : 0),
          ),
        ),
      );

      const due = Math.max(
        0,
        toNumber(
          order?.balance ??
            order?.due_amount ??
            order?.pending_amount ??
            amount - paid,
        ),
      );

      let status = "Pending";

      if (due <= 0 || (amount > 0 && paid >= amount)) {
        status = "Paid";
      } else if (paid > 0) {
        status = "Partial";
      }

      const paymentDueDate =
        order?.payment_due_date || order?.payment_deadline || order?.due_date;

      if (due > 0 && paymentDueDate) {
        const parsedDate = new Date(paymentDueDate);

        if (!Number.isNaN(parsedDate.getTime())) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          parsedDate.setHours(0, 0, 0, 0);

          if (parsedDate < today) status = "Overdue";
        }
      }

      const matchingRecords = paymentRecords.filter((record) => {
        const recordOrderId =
          record?.order_id ??
          record?.order ??
          record?.orderslip ??
          record?.order_details?.id;

        const recordSlipNo =
          record?.slip_no ??
          record?.order_slip_no ??
          record?.order_details?.slip_no;

        const idMatches =
          recordOrderId != null &&
          String(
            typeof recordOrderId === "object"
              ? recordOrderId.id
              : recordOrderId,
          ) === String(order?.id);

        const slipMatches =
          recordSlipNo != null &&
          String(recordSlipNo) === String(order?.slip_no);

        return idMatches || slipMatches;
      });

      const methodNames = [
        ...new Set(
          matchingRecords
            .map(getPaymentMethod)
            .filter(Boolean)
            .map((method) => String(method).trim()),
        ),
      ];

      return {
        // Keep the actual order ID separately for the Transactions page.
        orderId: order?.id ?? order?.uuid ?? null,

        id: String(
          order?.id ?? order?.uuid ?? order?.slip_no ?? `ORDER-${index + 1}`,
        ),

        pasalId: getPasalId(order),
        invoice: getInvoiceNumber(order),
        customer: getCustomerName(order),
        project: getProjectName(order),
        date: getOrderDate(order),
        amount,
        paid,
        due,
        method: methodNames.join(", "),
        status,
      };
    });
  }, [orders, paymentRecords]);

  const totalInvoiced = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const totalReceived = payments.reduce(
    (total, payment) => total + payment.paid,
    0,
  );

  const totalDue = payments.reduce((total, payment) => total + payment.due, 0);

  const overdueAmount = payments
    .filter((payment) => payment.status === "Overdue")
    .reduce((total, payment) => total + payment.due, 0);

  const collectionRate = totalInvoiced
    ? Math.min(100, Math.round((totalReceived / totalInvoiced) * 100))
    : 0;

  const methodSummary = useMemo(() => {
    const summary = {};

    paymentRecords.forEach((record) => {
      const method = getPaymentMethod(record);
      const amount = getRecordPaidAmount(record);

      if (!method || amount <= 0) return;

      const normalizedMethod = String(method).trim();
      if (!normalizedMethod) return;

      summary[normalizedMethod] = (summary[normalizedMethod] || 0) + amount;
    });

    return Object.entries(summary).sort((a, b) => b[1] - a[1]);
  }, [paymentRecords]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700";
      case "Partial":
        return "bg-orange-50 text-orange-700";
      case "Pending":
        return "bg-yellow-50 text-yellow-700";
      case "Overdue":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getMethodStyle = (method) => {
    const value = String(method).toLowerCase();

    if (value.includes("cash")) return "bg-green-50 text-green-700";
    if (value.includes("bank")) return "bg-blue-50 text-blue-700";
    if (value.includes("esewa")) return "bg-emerald-50 text-emerald-700";
    if (value.includes("khalti")) return "bg-purple-50 text-purple-700";

    return "bg-slate-100 text-slate-600";
  };

  const getMethodIcon = (method) => {
    const value = String(method).toLowerCase();

    if (
      value.includes("esewa") ||
      value.includes("khalti") ||
      value.includes("mobile")
    ) {
      return <FiSmartphone size={17} />;
    }

    if (value.includes("cash")) {
      return <FaMoneyBillWave size={17} />;
    }

    return <FiCreditCard size={17} />;
  };

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch = [
        payment.customer,
        payment.invoice,
        payment.project,
        payment.id,
        payment.method,
      ].some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus =
        paymentFilter === "All" || payment.status === paymentFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, paymentFilter]);

  const exportReport = () => {
    if (filteredPayments.length === 0) {
      window.alert("There are no payment records to export.");
      return;
    }

    const headers = [
      "Payment ID",
      "Invoice / Slip",
      "Customer",
      "Project",
      "Date",
      "Amount",
      "Paid",
      "Due",
      "Payment Method",
      "Status",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.invoice,
      payment.customer,
      payment.project,
      payment.date ? formatDate(payment.date) : "",
      payment.amount,
      payment.paid,
      payment.due,
      payment.method || "Not provided",
      payment.status,
    ]);

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "printtech-payment-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Shared link style for desktop and mobile.
  const invoiceLinkClass =
    "!text-slate-700 hover:!text-orange-500 hover:underline " +
    "focus-visible:!text-orange-500 focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-orange-400 " +
    "focus-visible:ring-offset-2 rounded-sm " +
    "transition-colors duration-200 dark:!text-slate-200 " +
    "dark:hover:!text-orange-400 dark:focus-visible:!text-orange-400";

  // Send the selected order and Pasal ID to the Transactions page.
  const getTransactionState = (payment) => ({
    orderId: payment.orderId,
    invoice: payment.invoice,
    pasalId: payment.pasalId || PASAL_ID,
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f7f8fa] dark:bg-slate-900">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-300">
          <FiRefreshCw className="animate-spin text-orange-500" size={20} />
          Loading payment report...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-900 dark:text-slate-200">
      <header className="border-b border-slate-200 bg-white px-5 py-5 dark:border-slate-700 dark:bg-slate-800 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiCreditCard className="text-orange-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Reports
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Payment Report
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track received, pending and overdue payments from your orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fetchPayments}
              className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>

            <button
              type="button"
              onClick={exportReport}
              className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <FiDownload size={17} />
              Export Report
            </button>
          </div>
        </div>
      </header>

      <main className="p-5 md:p-8">
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-semibold">Unable to load payment data</p>
                <p className="mt-1 break-words">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchPayments}
              className="w-fit shrink-0 rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Total Invoiced</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {formatAmount(totalInvoiced)}
                </h3>
                <p className="mt-2 text-xs text-slate-400">
                  {payments.length} orders
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FaMoneyBillWave size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Total Received</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {formatAmount(totalReceived)}
                </h3>
                <p className="mt-2 text-xs text-slate-400">
                  Payments collected
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiCheckCircle size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Pending Amount</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {formatAmount(totalDue)}
                </h3>
                <p className="mt-2 text-xs text-slate-400">Remaining balance</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiClock size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Overdue</p>
                <h3 className="mt-2 text-2xl font-bold">
                  {formatAmount(overdueAmount)}
                </h3>
                <p className="mt-2 text-xs text-slate-400">
                  Past-due payment balances
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FiAlertCircle size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Payment method summary and collection progress */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Payment Method Summary
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Total received grouped by payment method
            </p>

            <div className="mt-6 space-y-3">
              {methodSummary.length > 0 ? (
                methodSummary.map(([method, amount]) => (
                  <div
                    key={method}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-700"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getMethodStyle(method)}`}
                      >
                        {getMethodIcon(method)}
                      </div>
                      <span className="text-sm font-medium">{method}</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatAmount(amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
                  <FiCreditCard className="mx-auto text-slate-400" size={24} />
                  <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    No payment method totals found
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Check the invoice API response and its payment method and
                    amount fields.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
                <span className="text-sm font-semibold">Payment records</span>
                <span className="text-sm font-bold">
                  {paymentRecords.length}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiDollarSign />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  Collection Progress
                </h3>
                <p className="text-xs text-slate-400">
                  Percentage of invoiced amount collected
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between gap-3">
                <span className="text-sm text-slate-500">Collection Rate</span>
                <span className="text-sm font-bold text-green-600">
                  {collectionRate}%
                </span>
              </div>

              <div
                className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
                role="progressbar"
                aria-valuenow={collectionRate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Collection rate"
              >
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${collectionRate}%` }}
                />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-green-700">Received</p>
                  <p className="mt-1 text-lg font-bold text-green-700">
                    {formatAmount(totalReceived)}
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs text-red-700">Remaining</p>
                  <p className="mt-1 text-lg font-bold text-red-700">
                    {formatAmount(totalDue)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Search and filter */}
        <div className="mb-6 mt-10 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search customer, invoice or project..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700"
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(event) => setPaymentFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-600 dark:bg-slate-700"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Transactions */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 p-6 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              Payment Transactions
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Orders with payment details retrieved from the server
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left dark:border-slate-700">
                  {[
                    "Order",
                    "Customer",
                    "Invoice / Slip",
                    "Date",
                    "Amount",
                    "Paid",
                    "Due",
                    "Method",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold">{payment.id}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {payment.project}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                      {payment.customer}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <Link
                        to={`/transactions?invoice=${encodeURIComponent(payment.invoice)}`}
                        state={getTransactionState(payment)}
                        className={`inline-block cursor-pointer text-sm font-semibold ${invoiceLinkClass}`}
                        aria-label={`Open invoice ${payment.invoice}`}
                        title="Open invoice details"
                      >
                        {payment.invoice}
                      </Link>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <FiCalendar size={15} />
                        {formatDate(payment.date)}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold">
                      {formatAmount(payment.amount)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-green-600">
                      {formatAmount(payment.paid)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-red-500">
                      {formatAmount(payment.due)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {payment.method ? (
                        payment.method.split(", ").map((method) => (
                          <span
                            key={method}
                            className={`mr-1 inline-block rounded-full px-3 py-1.5 text-xs font-semibold ${getMethodStyle(method)}`}
                          >
                            {method}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          Not provided
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(payment.status)}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-14 text-center text-sm text-slate-500"
                    >
                      {error
                        ? "Payment records could not be loaded."
                        : payments.length === 0
                          ? "No orders are available for this report."
                          : "No payment records match your search or filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-4 md:hidden">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{payment.customer}</p>

                    <Link
                      to={`/transactions?invoice=${encodeURIComponent(payment.invoice)}`}
                      state={getTransactionState(payment)}
                      className={`inline-block cursor-pointer text-sm font-semibold ${invoiceLinkClass}`}
                      aria-label={`Open invoice ${payment.invoice}`}
                      title="Open invoice details"
                    >
                      {payment.invoice}
                    </Link>

                    <p className="mt-1 text-xs text-slate-400">
                      {payment.project}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(payment.status)}`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Amount</p>
                    <p className="mt-1 text-sm font-bold">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Paid</p>
                    <p className="mt-1 text-sm font-bold text-green-600">
                      {formatAmount(payment.paid)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Due</p>
                    <p className="mt-1 text-sm font-bold text-red-500">
                      {formatAmount(payment.due)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Method</p>
                    {payment.method ? (
                      payment.method.split(", ").map((method) => (
                        <span
                          key={method}
                          className={`mr-1 mt-1 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${getMethodStyle(method)}`}
                        >
                          {method}
                        </span>
                      ))
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">
                        Not provided
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <p className="text-[11px] text-slate-400">Date</p>
                    <p className="mt-1 text-sm">{formatDate(payment.date)}</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredPayments.length === 0 && (
              <div className="py-10 text-center text-sm text-slate-500">
                {error
                  ? "Payment records could not be loaded."
                  : payments.length === 0
                    ? "No orders are available for this report."
                    : "No payment records match your search or filter."}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PaymentReport;
