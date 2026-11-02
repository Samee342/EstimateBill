import React, { useEffect, useRef, useState } from "react";
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

const EstimateHeader = ({ register, errors, setValue, slipNumber }) => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  const searchRef = useRef(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    pan_no: "",
    address: "",
    contact_no: "",
  });

  // GET CUSTOMERS
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);

        const response = await getCustomer();
        console.log("Customer API response:", response);

        const data = response?.data ?? response;
        let customerList = [];

        if (Array.isArray(data)) {
          customerList = data;
        } else if (Array.isArray(data?.results)) {
          customerList = data.results;
        } else if (Array.isArray(data?.customers)) {
          customerList = data.customers;
        } else if (Array.isArray(data?.data)) {
          customerList = data.data;
        } else if (Array.isArray(data?.data?.results)) {
          customerList = data.data.results;
        }

        setCustomers(customerList);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
        toast.error(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            "Failed to load customers.",
        );
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // SEARCH CUSTOMERS
  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return false;

    const name = String(
      customer.name ?? customer.customer_name ?? "",
    ).toLowerCase();

    const phone = String(
      customer.contact_no ?? customer.phone_no ?? customer.phone ?? "",
    ).toLowerCase();

    const pan = String(customer.pan_no ?? customer.pan ?? "").toLowerCase();

    return (
      name.includes(searchTerm) ||
      phone.includes(searchTerm) ||
      pan.includes(searchTerm)
    );
  });

  // SELECT CUSTOMER
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);

    setValue("customer", customer.id ?? customer.uuid ?? "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("customerName", customer.name || customer.customer_name || "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("pan_no", customer.pan_no || customer.pan || "");
    setValue(
      "contact_no",
      customer.contact_no || customer.phone_no || customer.phone || "",
    );
    setValue("address", customer.address || "");

    setSearch("");
  };

  // ADD CUSTOMER
  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(newCustomer.contact_no)) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      setCreatingCustomer(true);

      const payload = {
        name: newCustomer.name.trim(),
        pan_no: newCustomer.pan_no.trim(),
        address: newCustomer.address.trim(),
        contact_no: newCustomer.contact_no.trim(),
      };

      const response = await createCustomer(payload);

      const createdCustomer =
        response?.customer ||
        response?.data?.customer ||
        response?.data ||
        response;

      if (
        !createdCustomer ||
        typeof createdCustomer !== "object" ||
        !(createdCustomer.name || createdCustomer.customer_name)
      ) {
        toast.error(
          "Customer response did not contain the expected customer details.",
        );
        return;
      }

      setCustomers((previous) => [...previous, createdCustomer]);
      handleSelectCustomer(createdCustomer);

      setNewCustomer({
        name: "",
        pan_no: "",
        address: "",
        contact_no: "",
      });

      setShowCustomerModal(false);
      toast.success("Customer added successfully!");
    } catch (error) {
      console.error("Create customer error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Failed to add customer.",
      );
    } finally {
      setCreatingCustomer(false);
    }
  };

  // CLEAR CUSTOMER
  const handleClearCustomer = () => {
    setSelectedCustomer(null);

    setValue("customer", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("customerName", "");
    setValue("pan_no", "");
    setValue("contact_no", "");
    setValue("address", "");
    setSearch("");
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

  const iconClass =
    "absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400";

  return (
    <>
      <div className="w-full px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
        {/* COMPACT HEADER */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              सीलीप नं:
            </label>
            <input
              type="text"
              value={slipNumber ?? ""}
              readOnly
              className="w-28 bg-slate-50 px-2 py-1.5 text-sm font-medium text-slate-600 outline-none dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Estimate Slip
            </h1>
            <p className="text-[11px] text-slate-400">Printing Estimate</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-300">
              मिति:
            </label>
            <input
              type="date"
              {...register("slip_date", {
                required: "Date is required",
              })}
              className="rounded-md border-b border-dashed border-slate-400 bg-transparent px-1.5 py-1.5 text-sm outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {errors?.slip_date && (
          <p className="mb-2 text-xs text-red-500">
            {errors.slip_date.message}
          </p>
        )}

        {/* CUSTOMER SECTION */}
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10">
                <FaUser className="text-xs" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Customer Information
                </h2>
                <p className="text-[11px] text-slate-400">
                  Select or add a customer
                </p>
              </div>
            </div>

            {selectedCustomer && (
              <button
                type="button"
                onClick={handleClearCustomer}
                className="text-xs font-medium text-slate-400 hover:text-red-500"
              >
                Clear customer
              </button>
            )}
          </div>

          {/* SEARCH + ADD CUSTOMER */}
          <div className="relative mb-4" ref={searchRef}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FaSearch className={iconClass} />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    selectedCustomer
                      ? selectedCustomer.name || selectedCustomer.customer_name
                      : "Search by customer name, phone or PAN..."
                  }
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700"
              >
                <FaPlus className="text-[10px]" />
                <span>Add Customer</span>
              </button>
            </div>

            {/* SEARCH RESULTS */}
            {search.trim().length > 0 && !selectedCustomer && (
              <div className="absolute left-0 right-0 top-[42px] z-30 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                {loadingCustomers ? (
                  <div className="px-4 py-4 text-center text-xs text-slate-400">
                    Loading customers...
                  </div>
                ) : filteredCustomers.length > 0 ? (
                  <div className="max-h-56 overflow-y-auto">
                    {filteredCustomers.map((customer, index) => {
                      const customerName =
                        customer.name ||
                        customer.customer_name ||
                        "Unnamed Customer";

                      const customerPhone =
                        customer.contact_no ||
                        customer.phone ||
                        customer.phone_no ||
                        "";

                      const customerId =
                        customer.uuid ??
                        customer.id ??
                        `${customerName}-${index}`;

                      return (
                        <button
                          type="button"
                          key={customerId}
                          onClick={() => handleSelectCustomer(customer)}
                          className="flex w-full items-center gap-2.5 border-b border-slate-100 px-3 py-2 text-left transition last:border-0 hover:bg-orange-50 dark:border-slate-700 dark:hover:bg-slate-700"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-600">
                            <FaUser className="text-[10px]" />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                              {customerName}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {customerPhone}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      No customer found.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(true)}
                      className="mt-1.5 text-xs font-semibold text-orange-600"
                    >
                      + Add new customer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            {/* NAME */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                नाम <span className="text-orange-500">*</span>
              </label>

              <div className="relative">
                <FaUser className={iconClass} />
                <input
                  type="text"
                  {...register("customerName", {
                    required: "Customer name is required",
                  })}
                  readOnly={!!selectedCustomer}
                  className={`${inputClass} ${
                    selectedCustomer
                      ? "border-orange-100 bg-orange-50/50 dark:bg-slate-800"
                      : ""
                  }`}
                  placeholder="Customer name"
                />
              </div>

              {errors?.customerName && (
                <p className="mt-1 text-[11px] text-red-500">
                  {errors.customerName.message}
                </p>
              )}
            </div>

            {/* PAN */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                पान नं
              </label>

              <div className="relative">
                <FaIdCard className={iconClass} />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={20}
                  {...register("pan_no")}
                  readOnly={!!selectedCustomer}
                  placeholder="PAN number"
                  className={inputClass}
                />
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                सम्पर्क नं
              </label>

              <div className="relative">
                <FaPhone className={iconClass} />
                <input
                  type="text"
                  {...register("contact_no")}
                  readOnly={!!selectedCustomer}
                  placeholder="Contact number"
                  className={inputClass}
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                ठेगाना
              </label>

              <div className="relative">
                <FaMapMarkerAlt className={iconClass} />
                <input
                  type="text"
                  {...register("address")}
                  readOnly={!!selectedCustomer}
                  placeholder="Customer address"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-slate-800">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Add New Customer
                </h2>
                <p className="text-[11px] text-slate-400">
                  Add without leaving this estimate
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
                disabled={creatingCustomer}
                aria-label="Close customer modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="space-y-3.5 p-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  Customer Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) =>
                    setNewCustomer((previous) => ({
                      ...previous,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={newCustomer.contact_no}
                  onChange={(e) => {
                    const phone = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    setNewCustomer((previous) => ({
                      ...previous,
                      contact_no: phone,
                    }));
                  }}
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                />

                {newCustomer.contact_no.length > 0 &&
                  newCustomer.contact_no.length !== 10 && (
                    <p className="mt-1 text-[11px] text-red-500">
                      Enter exactly 10 digits.
                    </p>
                  )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  PAN Number
                </label>
                <input
                  type="text"
                  value={newCustomer.pan_no}
                  onChange={(e) =>
                    setNewCustomer((previous) => ({
                      ...previous,
                      pan_no: e.target.value,
                    }))
                  }
                  placeholder="PAN number"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                  Address
                </label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer((previous) => ({
                      ...previous,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Customer address"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
                disabled={creatingCustomer}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddCustomer}
                disabled={creatingCustomer}
                className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingCustomer ? "Adding..." : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimateHeader;
