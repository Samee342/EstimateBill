import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMapPin,
  FiMoreVertical,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AllCustomers = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Mock customer data
  // Later this will come from your API/database
  const [customers, setCustomers] = useState([
    {
      id: "CUS-1001",
      name: "Ram Sharma",
      phone: "9841234567",
      pan: "601234567",
      address: "Nepalgunj, Banke",
      projects: 12,
      totalAmount: 125000,
      status: "Active",
    },
    {
      id: "CUS-1002",
      name: "Sita Karki",
      phone: "9851234567",
      pan: "602345678",
      address: "Kohalpur, Banke",
      projects: 8,
      totalAmount: 87500,
      status: "Active",
    },
    {
      id: "CUS-1003",
      name: "Hari Thapa",
      phone: "9861234567",
      pan: "603456789",
      address: "Dhangadhi, Kailali",
      projects: 15,
      totalAmount: 210500,
      status: "Active",
    },
    {
      id: "CUS-1004",
      name: "Mina Rai",
      phone: "9871234567",
      pan: "604567890",
      address: "Butwal, Rupandehi",
      projects: 5,
      totalAmount: 45600,
      status: "Inactive",
    },
    {
      id: "CUS-1005",
      name: "Aashish Gurung",
      phone: "9801234567",
      pan: "605678901",
      address: "Pokhara, Kaski",
      projects: 10,
      totalAmount: 156800,
      status: "Active",
    },
    {
      id: "CUS-1006",
      name: "Everest Traders",
      phone: "9811234567",
      pan: "606789012",
      address: "Biratnagar, Morang",
      projects: 22,
      totalAmount: 385000,
      status: "Active",
    },
    {
      id: "CUS-1007",
      name: "ABC Enterprises",
      phone: "9821234567",
      pan: "607890123",
      address: "Kathmandu",
      projects: 3,
      totalAmount: 28700,
      status: "Inactive",
    },
    {
      id: "CUS-1008",
      name: "New Star Hotel",
      phone: "9831234567",
      pan: "608901234",
      address: "Nepalgunj, Banke",
      projects: 18,
      totalAmount: 275400,
      status: "Active",
    },
  ]);

  // Search + filter
  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(searchValue) ||
      customer.phone.includes(searchValue) ||
      customer.address.toLowerCase().includes(searchValue) ||
      customer.id.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "All" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Delete customer
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) return;

    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  // View customer
  const handleView = (id) => {
    navigate(`/customers/${id}`);
  };

  // Edit customer
  const handleEdit = (id) => {
    navigate(`/customers/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-700 p-6">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-xl text-orange-500" />

            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-300">
              All Customers
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage your customers and their project history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/customers/add")}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <FiPlus size={18} />
          Add Customer
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}
        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Customers</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-300">
            {customers.length}
          </h2>
        </div>

        {/* Active */}
        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Customers</p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {
              customers.filter((customer) => customer.status === "Active")
                .length
            }
          </h2>
        </div>

        {/* Projects */}
        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Projects</p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {customers.reduce(
              (total, customer) => total + customer.projects,
              0,
            )}
          </h2>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Business</p>

          <h2 className="mt-2 text-2xl font-bold text-orange-500">
            Rs.{" "}
            {customers
              .reduce((total, customer) => total + customer.totalAmount, 0)
              .toLocaleString()}
          </h2>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-slate-800 shadow-sm">
        {/* SEARCH + FILTER */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer.."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white dark:bg-slate-500 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:bg-slate-800 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Projects
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Total Business
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs text-center font-semibold uppercase text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 hover:bg-slate-800"
                  >
                    {/* CUSTOMER */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {customer.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiPhone size={14} className="text-slate-400" />

                        {customer.phone}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <FiMapPin size={13} />
                        {customer.address}
                      </div>
                    </td>

                    {/* PROJECTS */}
                    <td className="px-5 py-4">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {customer.projects}
                      </span>
                    </td>

                    {/* TOTAL */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-300">
                        Rs. {customer.totalAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          customer.status === "Active"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleView(customer.id)}
                          title="View"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-100 hover:text-blue-600"
                        >
                          <FiEye size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEdit(customer.id)}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-yellow-100 hover:text-yellow-600"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(customer.id)}
                          title="Delete"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <FiUsers size={40} className="mb-3 text-slate-300" />

                      <h3 className="font-semibold text-slate-700">
                        No customers found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filter.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="divide-y divide-slate-100 md:hidden">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {customer.name}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">{customer.id}</p>
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      customer.status === "Active"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <FiPhone size={14} className="text-slate-400" />
                    {customer.phone}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <FiMapPin size={14} className="text-slate-400" />
                    {customer.address}
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Projects</span>

                    <span className="font-medium text-slate-700">
                      {customer.projects}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Business</span>

                    <span className="font-semibold text-slate-800">
                      Rs. {customer.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleView(customer.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                  >
                    <FiEye size={15} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEdit(customer.id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-100"
                  >
                    <FiEdit2 size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(customer.id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-16 text-center">
              <FiUsers size={40} className="mx-auto mb-3 text-slate-300" />

              <h3 className="font-semibold text-slate-700">
                No customers found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCustomers;
