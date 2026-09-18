import React, { useMemo, useState } from "react";
import {
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiDownload,
  FiCreditCard,
  FiCalendar,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

const PaymentReport = () => {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const payments = [
    {
      id: "PAY-1001",
      invoice: "INV-2026-001",
      customer: "Ram Sharma",
      project: "Business Card Printing",
      date: "07 Sep 2026",
      amount: 12500,
      paid: 12500,
      due: 0,
      method: "Cash",
      status: "Paid",
    },
    {
      id: "PAY-1002",
      invoice: "INV-2026-002",
      customer: "Sita Karki",
      project: "Wedding Invitation Cards",
      date: "07 Sep 2026",
      amount: 18750,
      paid: 10000,
      due: 8750,
      method: "Bank",
      status: "Partial",
    },
    {
      id: "PAY-1003",
      invoice: "INV-2026-003",
      customer: "Hari Thapa",
      project: "Restaurant Menu Printing",
      date: "06 Sep 2026",
      amount: 24300,
      paid: 24300,
      due: 0,
      method: "eSewa",
      status: "Paid",
    },
    {
      id: "PAY-1004",
      invoice: "INV-2026-004",
      customer: "Aashish Gurung",
      project: "Flex Banner Design",
      date: "06 Sep 2026",
      amount: 5600,
      paid: 0,
      due: 5600,
      method: "Cash",
      status: "Pending",
    },
    {
      id: "PAY-1005",
      invoice: "INV-2026-005",
      customer: "Mina Rai",
      project: "Company Brochure",
      date: "05 Sep 2026",
      amount: 18900,
      paid: 18900,
      due: 0,
      method: "Bank",
      status: "Paid",
    },
    {
      id: "PAY-1006",
      invoice: "INV-2026-006",
      customer: "Everest Traders",
      project: "Product Label Printing",
      date: "04 Sep 2026",
      amount: 32500,
      paid: 20000,
      due: 12500,
      method: "Khalti",
      status: "Partial",
    },
    {
      id: "PAY-1007",
      invoice: "INV-2026-007",
      customer: "ABC Enterprises",
      project: "Office Letterhead",
      date: "03 Sep 2026",
      amount: 7800,
      paid: 7800,
      due: 0,
      method: "Cash",
      status: "Paid",
    },
    {
      id: "PAY-1008",
      invoice: "INV-2026-008",
      customer: "New Star Hotel",
      project: "Promotional Posters",
      date: "02 Sep 2026",
      amount: 15400,
      paid: 5000,
      due: 10400,
      method: "Bank",
      status: "Overdue",
    },
  ];

  // ------------------------------------
  // Calculations
  // ------------------------------------

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

  // ------------------------------------
  // Status
  // ------------------------------------

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

  // ------------------------------------
  // Payment Method Style
  // ------------------------------------

  const getMethodStyle = (method) => {
    switch (method) {
      case "Cash":
        return "bg-green-50 text-green-700";

      case "Bank":
        return "bg-blue-50 text-blue-700";

      case "eSewa":
        return "bg-emerald-50 text-emerald-700";

      case "Khalti":
        return "bg-purple-50 text-purple-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ------------------------------------
  // Filter
  // ------------------------------------

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.customer.toLowerCase().includes(search.toLowerCase()) ||
        payment.invoice.toLowerCase().includes(search.toLowerCase()) ||
        payment.project.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.toLowerCase().includes(search.toLowerCase());

      const matchesPayment =
        paymentFilter === "All" || payment.status === paymentFilter;

      return matchesSearch && matchesPayment;
    });
  }, [search, paymentFilter]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-800 text-slate-800">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white dark:bg-slate-800 px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiCreditCard className="text-orange-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Reports
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-200">
              Payment Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Track received, pending and overdue payments.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            <FiDownload size={17} />
            Export Report
          </button>
        </div>
      </header>

      <main className="p-5 md:p-8">
        {/* Search + Filter */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800  p-4">
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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:text-slate-200 dark:bg-slate-700 bg-slate-50 d py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 "
              />
            </div>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white dark:bg-slate-700 dark:text-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Invoiced */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Invoiced</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-200">
                  Rs. {totalInvoiced.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FaMoneyBillWave size={21} />
              </div>
            </div>
          </div>

          {/* Received */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Received</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-300">
                  Rs. {totalReceived.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiCheckCircle size={21} />
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Amount</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-200">
                  Rs. {totalDue.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FiClock size={21} />
              </div>
            </div>
          </div>

          {/* Overdue */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Overdue</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-300">
                  Rs. {overdueAmount.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FiAlertCircle size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Payment Method Summary */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-200">
              Payment Method Summary
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Amount received by payment method
            </p>

            <div className="mt-6 space-y-4 dark:text-slate-200">
              {["Cash", "Bank", "eSewa", "Khalti"].map((method) => {
                const amount = payments
                  .filter((payment) => payment.method === method)
                  .reduce((total, payment) => total + payment.paid, 0);

                return (
                  <div
                    key={method}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${getMethodStyle(
                          method,
                        )}`}
                      >
                        <FiCreditCard size={17} />
                      </div>

                      <span className="text-sm font-medium">{method}</span>
                    </div>

                    <span className="text-sm font-bold">
                      Rs. {amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collection Progress */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiDollarSign />
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-200">
                  Collection Progress
                </h3>

                <p className="text-xs text-slate-400">
                  How much invoiced amount has been collected
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Collection Rate</span>

                <span className="text-sm font-bold text-green-600">
                  {totalInvoiced
                    ? Math.round((totalReceived / totalInvoiced) * 100)
                    : 0}
                  %
                </span>
              </div>

              <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${
                      totalInvoiced ? (totalReceived / totalInvoiced) * 100 : 0
                    }%`,
                  }}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs text-green-700">Received</p>

                  <p className="mt-1 text-lg font-bold text-green-700">
                    Rs. {totalReceived.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs text-red-700">Remaining</p>

                  <p className="mt-1 text-lg font-bold text-red-700">
                    Rs. {totalDue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Transactions */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 ">
          <div className="border-b border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-200">
              Payment Transactions
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Invoice and payment collection details
            </p>
          </div>

          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Invoice
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Paid
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Due
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Method
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold dark:text-slate-200">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {payment.project}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm font-medium dark:text-slate-200">
                      {payment.customer}
                    </td>

                    <td className="px-6 py-4 text-sm text-orange-600">
                      {payment.invoice}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FiCalendar size={15} />

                        {payment.date}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold dark:text-slate-200">
                      Rs. {payment.amount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      Rs. {payment.paid.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-red-500">
                      Rs. {payment.due.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getMethodStyle(
                          payment.method,
                        )}`}
                      >
                        {payment.method}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{payment.customer}</p>

                    <p className="mt-1 text-xs text-orange-500">
                      {payment.invoice}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(
                      payment.status,
                    )}`}
                  >
                    {payment.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Amount</p>

                    <p className="mt-1 text-sm font-bold">
                      Rs. {payment.amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Paid</p>

                    <p className="mt-1 text-sm font-bold text-green-600">
                      Rs. {payment.paid.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Due</p>

                    <p className="mt-1 text-sm font-bold text-red-500">
                      Rs. {payment.due.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Method</p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${getMethodStyle(
                        payment.method,
                      )}`}
                    >
                      {payment.method}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentReport;
