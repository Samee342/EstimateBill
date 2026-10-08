import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiMail,
  FiBriefcase,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { deleteCustomer, getCustomer } from "../../api/customer";
import DeleteModal from "../../modal/DeleteModal";
import { toast } from "react-hot-toast"

const AllCustomers = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("All");

  const [customers, setCustomers] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ========================================
  // GET CUSTOMERS
  // ========================================

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomer();

        console.log("Customers API response:", response);

        if (Array.isArray(response)) {
          setCustomers(response);
        } else if (Array.isArray(response?.results)) {
          setCustomers(response.results);
        } else if (Array.isArray(response?.data)) {
          setCustomers(response.data);
        } else if (Array.isArray(response?.data?.results)) {
          setCustomers(response.data.results);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        console.error("Get customers error:", error);
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []);

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      customer.name?.toLowerCase().includes(searchValue) ||
      customer.contact_no?.toString().includes(searchValue) ||
      customer.email?.toLowerCase().includes(searchValue) ||
      customer.company?.toLowerCase().includes(searchValue) ||
      customer.address?.toLowerCase().includes(searchValue) ||
      customer.uuid?.toString().toLowerCase().includes(searchValue);

    const matchesType =
      customerTypeFilter === "All" ||
      customer.customer_type === customerTypeFilter;

    return matchesSearch && matchesType;
  });

  // ========================================
  // OPEN DELETE MODAL
  // ========================================

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  // ========================================
  // CONFIRM DELETE
  // ========================================

  const handleDeleteConfirm = async () => {
  if (!selectedCustomer?.uuid) return;

  try {
    setDeleteLoading(true);

    await deleteCustomer(selectedCustomer.uuid);

    setCustomers((prev) =>
      prev.filter((customer) => customer.uuid !== selectedCustomer.uuid),
    );

    setDeleteModalOpen(false);
    setSelectedCustomer(null);

    toast.success("Customer deleted successfully!");
  } catch (error) {
    console.error("Delete customer error:", error);

    toast.error("Failed to delete customer.");
  } finally {
    setDeleteLoading(false);
  }
};

  // ========================================
  // CLOSE DELETE MODAL
  // ========================================

  const handleDeleteClose = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  

  // ========================================
  // EDIT CUSTOMER
  // ========================================

  const handleEdit = (uuid) => {
    navigate(`/customers/${uuid}/edit`);
  };

  // ========================================
  // TOTAL CUSTOMERS
  // ========================================

  const totalCustomers = customers.length;

  // ========================================
  // INDIVIDUAL CUSTOMERS
  // ========================================

  const individualCustomers = customers.filter(
    (customer) => customer.customer_type === "individual",
  ).length;

  // ========================================
  // BUSINESS CUSTOMERS
  // ========================================

  const businessCustomers = customers.filter(
    (customer) => customer.customer_type === "business",
  ).length;

  // ========================================
  // CUSTOMERS WITH EMAIL
  // ========================================

  const customersWithEmail = customers.filter(
    (customer) => customer.email,
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-700">
      {/* ======================================== */}
      {/* PAGE HEADER */}
      {/* ======================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-xl text-orange-500" />

            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-300">
              All Customers
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage your customers and their information.
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

      {/* ======================================== */}
      {/* SUMMARY CARDS */}
      {/* ======================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500">Total Customers</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-slate-300">
            {totalCustomers}
          </h2>
        </div>

        {/* Individual */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500">Individual</p>

          <h2 className="mt-2 text-2xl font-bold text-orange-500">
            {individualCustomers}
          </h2>
        </div>

        {/* Business */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500">Business</p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {businessCustomers}
          </h2>
        </div>

        {/* Email */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-800">
          <p className="text-sm font-medium text-slate-500">With Email</p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {customersWithEmail}
          </h2>
        </div>
      </div>

      {/* ======================================== */}
      {/* TABLE CARD */}
      {/* ======================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-800">
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
              placeholder="Search name, phone, email, company..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>

          {/* Customer Type Filter */}

          <select
            value={customerTypeFilter}
            onChange={(e) => setCustomerTypeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-500 dark:bg-slate-500 dark:text-white"
          >
            <option value="All">All Customers</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* ======================================== */}
        {/* DESKTOP TABLE */}
        {/* ======================================== */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left dark:bg-slate-800">
                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Company
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Type
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                  Address
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.uuid}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {/* CUSTOMER */}

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleView(customer.uuid)}
                        className="group text-left"
                      >
                        <p className="font-semibold text-slate-800 transition group-hover:text-orange-500 dark:text-slate-200">
                          {customer.name || "Unnamed Customer"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          UID: {customer.uuid}
                        </p>
                      </button>
                    </td>

                    {/* CONTACT */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <FiPhone size={14} className="text-slate-400" />

                        {customer.contact_no || "No contact"}
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <FiMail size={13} />

                        {customer.email || "No email"}
                      </div>
                    </td>

                    {/* COMPANY */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <FiBriefcase size={14} className="text-slate-400" />

                        {customer.company || "—"}
                      </div>
                    </td>

                    {/* CUSTOMER TYPE */}

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          customer.customer_type === "business"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-orange-200 bg-orange-50 text-orange-700"
                        }`}
                      >
                        {customer.customer_type || "individual"}
                      </span>
                    </td>

                    {/* ADDRESS */}

                    <td className="px-5 py-4">
                      <div className="flex max-w-[220px] items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <FiMapPin
                          size={14}
                          className="shrink-0 text-slate-400"
                        />

                        <span className="truncate">
                          {customer.address || "No address"}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                       

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() => handleEdit(customer.uuid)}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-yellow-100 hover:text-yellow-600"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(customer)}
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
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <FiUsers size={40} className="mb-3 text-slate-300" />

                      <h3 className="font-semibold text-slate-700">
                        No customers found
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {customers.length === 0
                          ? "You have not added any customers yet."
                          : "Try changing your search or filter."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======================================== */}
        {/* MOBILE CARDS */}
        {/* ======================================== */}

        <div className="divide-y divide-slate-100 md:hidden">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.uuid} className="p-4">
                {/* Header */}

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => handleView(customer.uuid)}
                      className="text-left font-semibold text-slate-800 transition hover:text-orange-500 dark:text-slate-200"
                    >
                      {customer.name || "Unnamed Customer"}
                    </button>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      UID: {customer.uuid}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
                      customer.customer_type === "business"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-orange-200 bg-orange-50 text-orange-700"
                    }`}
                  >
                    {customer.customer_type || "individual"}
                  </span>
                </div>

                {/* Customer Information */}

                <div className="mt-4 space-y-3 text-sm">
                  {/* Phone */}

                  <div className="flex items-center gap-2 text-slate-600">
                    <FiPhone size={14} className="shrink-0 text-slate-400" />

                    <span>{customer.contact_no || "No contact"}</span>
                  </div>

                  {/* Email */}

                  <div className="flex items-center gap-2 text-slate-600">
                    <FiMail size={14} className="shrink-0 text-slate-400" />

                    <span className="truncate">
                      {customer.email || "No email"}
                    </span>
                  </div>

                  {/* Company */}

                  <div className="flex items-center gap-2 text-slate-600">
                    <FiBriefcase
                      size={14}
                      className="shrink-0 text-slate-400"
                    />

                    <span>{customer.company || "No company"}</span>
                  </div>

                  {/* Address */}

                  <div className="flex items-start gap-2 text-slate-600">
                    <FiMapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <span>{customer.address || "No address"}</span>
                  </div>
                </div>

                {/* MOBILE ACTIONS */}

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  {/* Edit */}

                  <button
                    type="button"
                    onClick={() => handleEdit(customer.uuid)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-100"
                  >
                    <FiEdit2 size={15} />
                    Edit
                  </button>

                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() => handleDeleteClick(customer)}
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
                {customers.length === 0
                  ? "You have not added any customers yet."
                  : "Try changing your search or filter."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================== */}
      {/* DELETE MODAL */}
      {/* ======================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        itemName={
          selectedCustomer
            ? `${selectedCustomer.name || "Customer"} • UID: ${
                selectedCustomer.uuid
              }`
            : ""
        }
        loading={deleteLoading}
      />
    </div>
  );
};

export default AllCustomers;
