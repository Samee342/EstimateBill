import React, { useMemo, useState } from "react";
import {
  FiUsers,
  FiUserPlus,
  FiDollarSign,
  FiClock,
  FiSearch,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

const CustomerReport = () => {
  const [search, setSearch] = useState("");

  const customers = [
    {
      id: "CUS-1001",
      name: "Ram Sharma",
      phone: "98XXXXXXXX",
      projects: 12,
      totalAmount: 125000,
      paid: 110000,
      due: 15000,
      lastOrder: "07 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1002",
      name: "Sita Karki",
      phone: "98XXXXXXXX",
      projects: 8,
      totalAmount: 87500,
      paid: 70000,
      due: 17500,
      lastOrder: "07 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1003",
      name: "Hari Thapa",
      phone: "98XXXXXXXX",
      projects: 15,
      totalAmount: 245000,
      paid: 245000,
      due: 0,
      lastOrder: "06 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1004",
      name: "Aashish Gurung",
      phone: "98XXXXXXXX",
      projects: 4,
      totalAmount: 32000,
      paid: 10000,
      due: 22000,
      lastOrder: "06 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1005",
      name: "Mina Rai",
      phone: "98XXXXXXXX",
      projects: 10,
      totalAmount: 156000,
      paid: 156000,
      due: 0,
      lastOrder: "05 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1006",
      name: "Everest Traders",
      phone: "98XXXXXXXX",
      projects: 22,
      totalAmount: 425000,
      paid: 350000,
      due: 75000,
      lastOrder: "04 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1007",
      name: "ABC Enterprises",
      phone: "98XXXXXXXX",
      projects: 6,
      totalAmount: 78000,
      paid: 78000,
      due: 0,
      lastOrder: "03 Sep 2026",
      status: "Active",
    },
    {
      id: "CUS-1008",
      name: "New Star Hotel",
      phone: "98XXXXXXXX",
      projects: 18,
      totalAmount: 315000,
      paid: 250000,
      due: 65000,
      lastOrder: "02 Sep 2026",
      status: "Active",
    },
  ];

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

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.id.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search),
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-800 text-slate-800">
      {/* Header */}

      <header className="border-b border-slate-200 bg-white dark:bg-slate-800 px-5 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FiUsers className="text-orange-500" />

              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Reports
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold dark:text-slate-300 text-slate-900">
              Customer Report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View customer-wise printing business and outstanding amounts.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            <FiDownload size={17} />
            Export Report
          </button>
        </div>
      </header>

      <main className="p-5 md:p-8">
        {/* Search */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-4">
          <div className="relative w-full md:max-w-md">
            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-700 dark:text-slate-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Customers */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Customers</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-200">
                  {customers.length}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <FiUsers size={21} />
              </div>
            </div>
          </div>

          {/* New */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">New Customers</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-200">
                  24
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <FiUserPlus size={21} />
              </div>
            </div>
          </div>

          {/* Business */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Customer Business</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-200">
                  Rs. {totalBusiness.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <FaMoneyBillWave size={21} />
              </div>
            </div>
          </div>

          {/* Due */}

          <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Due</p>

                <h3 className="mt-2 text-2xl font-bold dark:text-slate-200">
                  Rs. {totalDue.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FiClock size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Table */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800">
          <div className="border-b border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 dark:text-slate-300">
              Customer-wise Report
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Printing projects and payment summary by customer
            </p>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Projects
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Total Business
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Paid
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Due
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Last Order
                  </th>

                  <th className="px-6 py-4 text-xs uppercase text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">
                          {customer.name.charAt(0)}
                        </div>

                        <div>
                          <p className="text-sm font-semibold dark:text-slate-300">
                            {customer.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {customer.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FiFileText className="text-slate-400" />

                        {customer.projects}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold dark:text-slate-300">
                      Rs. {customer.totalAmount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      Rs. {customer.paid.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-red-500">
                      Rs. {customer.due.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {customer.lastOrder}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="space-y-3 p-4 md:hidden">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-600">
                    {customer.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{customer.name}</p>

                    <p className="text-xs text-slate-400">{customer.id}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Projects</p>

                    <p className="mt-1 text-sm font-semibold">
                      {customer.projects}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Business</p>

                    <p className="mt-1 text-sm font-semibold">
                      Rs. {customer.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Paid</p>

                    <p className="mt-1 text-sm font-semibold text-green-600">
                      Rs. {customer.paid.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-slate-400">Due</p>

                    <p className="mt-1 text-sm font-semibold text-red-500">
                      Rs. {customer.due.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Summary */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-300">
                Payment Summary
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Customer receivable summary
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-green-500"
              style={{
                width: `${(totalPaid / totalBusiness) * 100}%`,
              }}
            />
          </div>

          <div className="mt-3 flex justify-between text-xs">
            <span className="text-green-600">
              Paid: Rs. {totalPaid.toLocaleString()}
            </span>

            <span className="text-red-500">
              Due: Rs. {totalDue.toLocaleString()}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerReport;
