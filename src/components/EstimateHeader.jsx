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

const EstimateHeader = ({ register, errors, setValue }) => {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [search, setSearch] = useState("");

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "ABC Traders",
      pan: "123456789",
      address: "Nepalgunj",
      contact: "9812345678",
    },
    {
      id: 2,
      name: "Ram Shrestha",
      pan: "987654321",
      address: "Kohalpur",
      contact: "9801234567",
    },
    {
      id: 3,
      name: "XYZ Enterprises",
      pan: "456789123",
      address: "Banke",
      contact: "9823456789",
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    pan: "",
    address: "",
    contact: "",
  });

  /*
    Filter customers while searching.
  */
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase()),
  );

  /*
    Select existing customer.
  */
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);

    /*
      Put customer information
      into React Hook Form.
    */
    setValue("customerName", customer.name);
    setValue("panNumber", customer.pan);
    setValue("address", customer.address);
    setValue("contactNumber", customer.contact);

    setSearch("");
  };

  /*
    Add new customer.
  */
  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) {
      return;
    }

    const customer = {
      id: Date.now(),
      name: newCustomer.name,
      pan: newCustomer.pan,
      address: newCustomer.address,
      contact: newCustomer.contact,
    };

    /*
      Add to customer list.
    */
    setCustomers((prev) => [...prev, customer]);

    /*
      Automatically select the new customer.
    */
    handleSelectCustomer(customer);

    /*
      Reset modal.
    */
    setNewCustomer({
      name: "",
      pan: "",
      address: "",
      contact: "",
    });

    setShowCustomerModal(false);
  };

  /*
    Clear selected customer.
  */
  const handleClearCustomer = () => {
    setSelectedCustomer(null);

    setValue("customerName", "");
    setValue("panNumber", "");
    setValue("address", "");
    setValue("contactNumber", "");
  };

  return (
    <>
      <div className="w-full p-6 text-sm text-slate-700">
        {/* 
            TOP ROW
         */}

        <div className="mb-7 flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
          {/* PPP */}
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

            <p className="mt-1 text-xs text-slate-400">Printing Estimate</p>
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
          <p className="mb-4 text-xs text-red-500">{errors.date.message}</p>
        )}

        {/* =====================================
            CUSTOMER SECTION
        ====================================== */}

        <div>
          {/* Section Heading */}
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
              {/* Search */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    selectedCustomer
                      ? selectedCustomer.name
                      : "Search customer..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500  focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* ADD CUSTOMER */}
              <button
                type="button"
                onClick={() => setShowCustomerModal(true)}
                className="flex h-[46px] shrink-0 items-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
              >
                <FaPlus className="text-xs" />

                <span className="hidden sm:inline">Add Customer</span>
              </button>
            </div>

            {/* Search Results */}
            {search && !selectedCustomer && (
              <div className="absolute left-0 right-0 top-[52px] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <button
                      type="button"
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-orange-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <FaUser className="text-xs" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                          {customer.name}
                        </p>

                        <p className="text-xs text-slate-400 dark:text-slate-300">
                          {customer.contact}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-5 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No customer found.
                    </p>

                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(true)}
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
                <span className="ml-1 text-orange-500">*</span>
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
                      : "border-slate-200 bg-slate-50 dark:bg-slate-500 focus:border-orange-500  focus:ring-2 focus:ring-orange-100"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-500 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500  focus:ring-2 focus:ring-orange-100"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-500 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-500 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500  focus:ring-2 focus:ring-orange-100"
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
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-700 shadow-2xl">
            {/* Modal Header */}
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
                onClick={() => setShowCustomerModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Customer Name
                  <span className="ml-1 text-orange-500">*</span>
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

              {/* Contact */}
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

              {/* Address */}
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

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 dark:bg-slate-700 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowCustomerModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddCustomer}
                className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EstimateHeader;
