import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
} from "react-icons/fa";

import { createCustomer, getCustomer } from "../api/customer";
import { toast } from "react-hot-toast";

const EstimateHeader = ({ register, errors, setValue }) => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    pan: "",
    address: "",
    contact: "",
  });

  // ==========================================
  // GET CUSTOMERS
  // ==========================================

  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);

      const response = await getCustomer();

      console.log("FULL CUSTOMER RESPONSE:", response);

      setCustomers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to load customers.");
    } finally {
      setLoadingCustomers(false);
    }
  };

  fetchCustomers();
}, []);

  // ==========================================
  // SEARCH CUSTOMERS
  // ==========================================

  const filteredCustomers = customers.filter((customer) => {
  const name = customer.name || "";
  const phone = customer.phone_no || "";

  return (
    name.toLowerCase().includes(search.toLowerCase()) ||
    phone.toLowerCase().includes(search.toLowerCase())
  );
});

  // ==========================================
  // SELECT CUSTOMER
  // ==========================================

  const handleSelectCustomer = (customer) => {
  setSelectedCustomer(customer);

  setValue("customerName", customer.name || "");
  setValue("panNumber", customer.pan_no || "");
  setValue("address", customer.address || "");
  setValue("contactNumber", customer.phone_no || "");

  setSearch("");
};
  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    try {
      setCreatingCustomer(true);

      const payload = {
        name: newCustomer.name.trim(),
        pan: newCustomer.pan.trim(),
        address: newCustomer.address.trim(),
        contact: newCustomer.contact.trim(),
      };

      console.log("Creating customer:", payload);

      const response = await createCustomer(payload);

      console.log("Created customer:", response);

      /*
        Backend may return:

        {
          customer: {...}
        }

        or directly:

        {...}
      */

      const createdCustomer =
        response?.customer ||
        response?.data?.customer ||
        response?.data ||
        response;

      // Add newly created customer to local list
      setCustomers((prev) => [...prev, createdCustomer]);

      // Automatically select it
      handleSelectCustomer(createdCustomer);

      // Reset modal form
      setNewCustomer({
        name: "",
        pan: "",
        address: "",
        contact: "",
      });

      setShowCustomerModal(false);

      toast.success("Customer added successfully!");
    } catch (error) {
      console.error("Create customer error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Failed to add customer."
      );
    } finally {
      setCreatingCustomer(false);
    }
  };

  // ==========================================
  // CLEAR CUSTOMER
  // ==========================================

  const handleClearCustomer = () => {
    setSelectedCustomer(null);

    setValue("customerName", "");
    setValue("panNumber", "");
    setValue("address", "");
    setValue("contactNumber", "");

    setSearch("");
  };

  return (
    <>
      <div className="w-full p-6 text-sm text-slate-700">
        {/* =====================================
            TOP ROW
        ====================================== */}

        <div className="mb-7 flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
          {/* SLIP NUMBER */}

          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-600 dark:text-slate-300">
              सीलीप नं:
            </label>

            <input
              type="text"
              {...register("slipNumber")}
              placeholder="Slip number"
              className="w-36 border-b border-dashed border-slate-400 bg-transparent px-1 py-1 outline-none transition focus:border-orange-500"
            />
          </div>

          {/* TITLE */}

          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Estimate Slip
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Printing Estimate
            </p>
          </div>

          {/* DATE */}

          <div className="flex items-center gap-2">
            <label className="font-semibold text-slate-600 dark:text-slate-300">
              मिति:
            </label>

            <input
              type="date"
              {...register("date", {
                required: "Date is required",
              })}
              className="border-b border-dashed border-slate-400 bg-transparent px-1 py-1 outline-none transition focus:border-orange-500"
            />
          </div>
        </div>

        {/* DATE ERROR */}

        {errors?.date && (
          <p className="mb-4 text-xs text-red-500">
            {errors.date.message}
          </p>
        )}

        {/* =====================================
            CUSTOMER SECTION
        ====================================== */}

        <div>
          {/* SECTION HEADING */}

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <FaUser className="text-sm" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-800 dark:text-slate-300">
                  Customer Information
                </h2>

                <p className="text-xs text-slate-400">
                  Select an existing customer or add a new one.
                </p>
              </div>
            </div>

            {selectedCustomer && (
              <button
                type="button"
                onClick={handleClearCustomer}
                className="text-xs font-medium text-slate-400 transition hover:text-red-500"
              >
                Clear customer
              </button>
            )}
          </div>

          {/* =====================================
              CUSTOMER SEARCH
          ====================================== */}

          <div className="relative mb-6">
            <div className="flex gap-2">
              {/* SEARCH */}

              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    selectedCustomer
                      ? selectedCustomer.name ||
                        selectedCustomer.customer_name
                      : "Search customer..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:bg-slate-800"
                />
              </div>

              {/* ADD CUSTOMER */}

              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="flex h-[46px] shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
              >
                <FaPlus className="text-xs" />

                <span className="hidden sm:inline">
                  Add Customer
                </span>
              </button>
            </div>

            {/* SEARCH RESULTS */}

            {search && !selectedCustomer && (
              <div className="absolute left-0 right-0 top-[52px] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                {loadingCustomers ? (
                  <div className="px-4 py-5 text-center text-sm text-slate-400">
                    Loading customers...
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => {
                    const customerName =
                      customer.name ||
                      customer.customer_name ||
                      "Unnamed Customer";

                    const customerPhone =
                      customer.contact ||
                      customer.phone ||
                      customer.phone_no ||
                      "";

                    const customerId =
                      customer.uuid ||
                      customer.id;

                    return (
                      <button
                        type="button"
                        key={customerId}
                        onClick={() =>
                          handleSelectCustomer(customer)
                        }
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-orange-50"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <FaUser className="text-xs" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {customerName}
                          </p>

                          <p className="text-xs text-slate-400">
                            {customerPhone}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-slate-500">
                      No customer found.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowCustomerModal(true)
                      }
                      className="mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700"
                    >
                      + Add new customer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =====================================
              CUSTOMER DETAILS
          ====================================== */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                नाम
                <span className="ml-1 text-orange-500">
                  *
                </span>
              </label>

              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                <input
                  type="text"
                  {...register("customerName", {
                    required: "Customer name is required",
                  })}
                  readOnly={!!selectedCustomer}
                  className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition ${
                    selectedCustomer
                      ? "border-orange-100 bg-orange-50/50 text-slate-700"
                      : "border-slate-200 bg-slate-50 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  }`}
                  placeholder="Customer name"
                />
              </div>

              {errors?.customerName && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* PAN */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                पान नं
              </label>

              <div className="relative">
                <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                <input
                  type="text"
                  {...register("panNumber")}
                  readOnly={!!selectedCustomer}
                  placeholder="PAN number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:bg-slate-500"
                />
              </div>
            </div>

            {/* CONTACT */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                सम्पर्क नं
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                <input
                  type="text"
                  {...register("contactNumber")}
                  readOnly={!!selectedCustomer}
                  placeholder="Contact number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:bg-slate-500"
                />
              </div>
            </div>

            {/* ADDRESS */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                ठेगाना
              </label>

              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                <input
                  type="text"
                  {...register("address")}
                  readOnly={!!selectedCustomer}
                  placeholder="Customer address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:bg-slate-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          ADD CUSTOMER MODAL
      ========================================== */}

      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-700">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-300">
                  Add New Customer
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Add a customer without leaving this estimate.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCustomerModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-5 p-6">
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Customer Name
                  <span className="ml-1 text-orange-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* CONTACT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Contact Number
                </label>

                <input
                  type="text"
                  value={newCustomer.contact}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      contact: e.target.value,
                    })
                  }
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* PAN */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  PAN Number
                </label>

                <input
                  type="text"
                  value={newCustomer.pan}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      pan: e.target.value,
                    })
                  }
                  placeholder="PAN number"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* ADDRESS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Address
                </label>

                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      address: e.target.value,
                    })
                  }
                  placeholder="Customer address"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:bg-slate-700">
              <button
                type="button"
                onClick={() =>
                  setShowCustomerModal(false)
                }
                disabled={creatingCustomer}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddCustomer}
                disabled={creatingCustomer}
                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingCustomer
                  ? "Adding..."
                  : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimateHeader;