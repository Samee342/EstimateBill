import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiUsers,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFolder,
  FiEye,
  FiX,
} from "react-icons/fi";

const customersData = [
  {
    id: "CUS-1001",
    name: "Ram Sharma",
    phone: "9841234567",
    email: "ram@example.com",
    company: "",
    address: "Nepalgunj, Banke",
    projects: 12,
    status: "Active",
  },
  {
    id: "CUS-1002",
    name: "Sita Karki",
    phone: "9851234567",
    email: "sita@example.com",
    company: "",
    address: "Kathmandu",
    projects: 8,
    status: "Active",
  },
  {
    id: "CUS-1003",
    name: "ABC Restaurant",
    phone: "9861234567",
    email: "abc@restaurant.com",
    company: "ABC Restaurant",
    address: "Butwal, Rupandehi",
    projects: 15,
    status: "Active",
  },
  {
    id: "CUS-1004",
    name: "Everest Traders",
    phone: "9871234567",
    email: "info@everesttraders.com",
    company: "Everest Traders",
    address: "Bharatpur, Chitwan",
    projects: 6,
    status: "Active",
  },
  {
    id: "CUS-1005",
    name: "New Star Hotel",
    phone: "9801234567",
    email: "newstar@example.com",
    company: "New Star Hotel",
    address: "Dhangadhi, Kailali",
    projects: 4,
    status: "Inactive",
  },
];

const StaffCustomers = () => {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customersData;
    }

    return customersData.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.id.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.company.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const activeCustomers = customersData.filter(
    (customer) => customer.status === "Active"
  ).length;

  const totalProjects = customersData.reduce(
    (total, customer) => total + customer.projects,
    0
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          Customers
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          Customers
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View customer information related to your assigned work.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL CUSTOMERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Total Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {customersData.length}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <FiUsers size={20} />
            </div>
          </div>
        </div>

        {/* ACTIVE */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Active Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {activeCustomers}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <FiUsers size={20} />
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Total Projects
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {totalProjects}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FiFolder size={20} />
            </div>
          </div>
        </div>
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
            onChange={(e) => setSearch(e.target.value)}
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

        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FiUsers size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different name or phone number.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Address
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Projects
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Action
                    </th>
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
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                            {customer.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {customer.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {customer.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <FiPhone size={13} />
                            {customer.phone}
                          </p>

                          <p className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                            <FiMail size={13} />
                            {customer.email}
                          </p>
                        </div>
                      </td>

                      {/* ADDRESS */}
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <FiMapPin size={14} />
                          {customer.address}
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
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            customer.status === "Active"
                              ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                        {customer.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {customer.name}
                        </h3>

                        <p className="text-xs text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        customer.status === "Active"
                          ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <FiPhone size={14} />
                      {customer.phone}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <FiMail size={14} />
                      {customer.email}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <FiMapPin size={14} />
                      {customer.address}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <FiFolder size={14} />
                      {customer.projects} projects
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCustomer(customer)
                    }
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

      {/* CUSTOMER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-orange-500">
                  Customer Details
                </p>

                <h2 className="mt-1 font-bold text-slate-900 dark:text-white">
                  {selectedCustomer.name}
                </h2>
              </div>

              <button
                type="button"
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
                value={selectedCustomer.phone}
              />

              <DetailRow
                icon={FiMail}
                label="Email"
                value={selectedCustomer.email}
              />

              <DetailRow
                icon={FiMapPin}
                label="Address"
                value={selectedCustomer.address}
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

const DetailRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm dark:bg-slate-700 dark:text-slate-300">
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StaffCustomers;