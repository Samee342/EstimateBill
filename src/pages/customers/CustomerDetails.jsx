import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiEdit2,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiTrash2,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

import { FaMoneyBillWave } from "react-icons/fa";

// ======================================================
// TEMPORARY CUSTOMER DATA
// Later this will come from your API
// ======================================================

const customers = [
  {
    id: "CUS-1001",
    name: "Ram Sharma",
    phone: "9841234567",
    pan: "601234567",
    address: "Nepalgunj, Banke",
    status: "Active",

    projects: [
      {
        id: "PRJ-1001",
        name: "Business Card Printing",
        date: "2026-09-07",
        dueDate: "2026-09-10",
        amount: 12500,
        status: "Completed",
      },
      {
        id: "PRJ-1010",
        name: "Company Letterhead",
        date: "2026-08-22",
        dueDate: "2026-08-27",
        amount: 7800,
        status: "Completed",
      },
      {
        id: "PRJ-1018",
        name: "Office Envelope Printing",
        date: "2026-08-10",
        dueDate: "2026-08-15",
        amount: 9600,
        status: "Printed",
      },
      {
        id: "PRJ-1024",
        name: "Promotional Flyers",
        date: "2026-07-28",
        dueDate: "2026-08-02",
        amount: 18500,
        status: "Completed",
      },
      {
        id: "PRJ-1031",
        name: "Product Catalogue",
        date: "2026-07-14",
        dueDate: "2026-07-20",
        amount: 32500,
        status: "Pending",
      },
    ],
  },

  {
    id: "CUS-1002",
    name: "Sita Karki",
    phone: "9851234567",
    pan: "602345678",
    address: "Kohalpur, Banke",
    status: "Active",

    projects: [
      {
        id: "PRJ-1002",
        name: "Wedding Invitation Cards",
        date: "2026-09-07",
        dueDate: "2026-09-15",
        amount: 18750,
        status: "Pending",
      },
      {
        id: "PRJ-1015",
        name: "Wedding Menu Cards",
        date: "2026-08-18",
        dueDate: "2026-08-22",
        amount: 12500,
        status: "Completed",
      },
      {
        id: "PRJ-1020",
        name: "Thank You Cards",
        date: "2026-08-02",
        dueDate: "2026-08-07",
        amount: 8400,
        status: "Printed",
      },
    ],
  },

  {
    id: "CUS-1003",
    name: "Hari Thapa",
    phone: "9861234567",
    pan: "603456789",
    address: "Dhangadhi, Kailali",
    status: "Active",

    projects: [
      {
        id: "PRJ-1003",
        name: "Restaurant Menu Printing",
        date: "2026-09-06",
        dueDate: "2026-09-12",
        amount: 24300,
        status: "Printed",
      },
      {
        id: "PRJ-1012",
        name: "Restaurant Table Tent",
        date: "2026-08-20",
        dueDate: "2026-08-25",
        amount: 9800,
        status: "Completed",
      },
      {
        id: "PRJ-1022",
        name: "Food Promotion Posters",
        date: "2026-07-30",
        dueDate: "2026-08-04",
        amount: 16500,
        status: "Completed",
      },
    ],
  },

  {
    id: "CUS-1004",
    name: "Mina Rai",
    phone: "9871234567",
    pan: "604567890",
    address: "Butwal, Rupandehi",
    status: "Inactive",

    projects: [
      {
        id: "PRJ-1005",
        name: "Company Brochure",
        date: "2026-09-05",
        dueDate: "2026-09-14",
        amount: 18900,
        status: "Completed",
      },
      {
        id: "PRJ-1017",
        name: "Business Cards",
        date: "2026-08-12",
        dueDate: "2026-08-16",
        amount: 7200,
        status: "Completed",
      },
    ],
  },

  {
    id: "CUS-1005",
    name: "Aashish Gurung",
    phone: "9801234567",
    pan: "605678901",
    address: "Pokhara, Kaski",
    status: "Active",

    projects: [
      {
        id: "PRJ-1004",
        name: "Flex Banner Design",
        date: "2026-09-06",
        dueDate: "2026-09-11",
        amount: 5600,
        status: "Pending",
      },
      {
        id: "PRJ-1026",
        name: "Event Posters",
        date: "2026-08-16",
        dueDate: "2026-08-20",
        amount: 14500,
        status: "Completed",
      },
    ],
  },

  {
    id: "CUS-1006",
    name: "Everest Traders",
    phone: "9811234567",
    pan: "606789012",
    address: "Biratnagar, Morang",
    status: "Active",

    projects: [
      {
        id: "PRJ-1006",
        name: "Product Label Printing",
        date: "2026-09-04",
        dueDate: "2026-09-13",
        amount: 32500,
        status: "Printed",
      },
      {
        id: "PRJ-1028",
        name: "Product Packaging",
        date: "2026-08-05",
        dueDate: "2026-08-12",
        amount: 45000,
        status: "Completed",
      },
    ],
  },

  {
    id: "CUS-1007",
    name: "ABC Enterprises",
    phone: "9821234567",
    pan: "607890123",
    address: "Kathmandu",
    status: "Inactive",

    projects: [
      {
        id: "PRJ-1007",
        name: "Office Letterhead",
        date: "2026-09-03",
        dueDate: "2026-09-09",
        amount: 7800,
        status: "Pending",
      },
    ],
  },

  {
    id: "CUS-1008",
    name: "New Star Hotel",
    phone: "9831234567",
    pan: "608901234",
    address: "Nepalgunj, Banke",
    status: "Active",

    projects: [
      {
        id: "PRJ-1008",
        name: "Promotional Posters",
        date: "2026-09-02",
        dueDate: "2026-09-08",
        amount: 15400,
        status: "Completed",
      },
      {
        id: "PRJ-1029",
        name: "Hotel Menu Printing",
        date: "2026-08-11",
        dueDate: "2026-08-17",
        amount: 22000,
        status: "Printed",
      },
    ],
  },
];

// ======================================================
// HELPERS
// ======================================================

const formatCurrency = (amount) => {
  return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
};

const statusStyles = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",

  Printed:
    "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

  Completed:
    "border-green-200 bg-green-50 text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
};

// ======================================================
// SMALL INFO COMPONENT
// ======================================================

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value || "-"}
      </p>
    </div>
  );
};

// ======================================================
// PAGE
// ======================================================

const CustomerDetails = () => {
  const { id, customerId } = useParams();

  const customerParam = id || customerId;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ====================================================
  // FIND CUSTOMER
  // ====================================================

  const customer = customers.find(
    (customerItem) =>
      customerItem.id.toLowerCase() === customerParam?.toLowerCase(),
  );
  // ====================================================
  // PROJECT FILTER
  // ====================================================

  const filteredProjects = useMemo(() => {
    if (!customer) return [];

    return customer.projects.filter((project) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        project.name.toLowerCase().includes(searchValue) ||
        project.id.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customer, search, statusFilter]);

  // ====================================================
  // CUSTOMER NOT FOUND
  // ====================================================

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
          >
            <FiArrowLeft size={17} />
            Back to Customers
          </button>

          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <FiUser size={24} />
            </div>

            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Customer Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No customer was found with ID{" "}
              <span className="font-semibold">{customerParam}</span>
            </p>

            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Back to Customers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // CALCULATIONS
  // ====================================================

  const totalProjects = customer.projects.length;

  const totalBusiness = customer.projects.reduce(
    (total, project) => total + project.amount,
    0,
  );

  // Temporary example calculation.
  // Later your backend should return actual payment values.
  const paidAmount = Math.round(totalBusiness * 0.72);

  const remainingAmount = totalBusiness - paidAmount;

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ==================================================
            CUSTOMER HEADER
        ================================================== */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              {/* AVATAR */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-xl font-bold text-orange-500 dark:bg-orange-500/10">
                {customer.name.charAt(0)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {customer.name}
                  </h1>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      customer.status === "Active"
                        ? "border-green-200 bg-green-50 text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                        : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">{customerParam}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2">
              {/* EDIT CUSTOMER */}
              <button
                type="button"
                onClick={() => navigate(`/customers/${customer.id}/edit`)}
                className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:hover:bg-orange-500/20"
              >
                <FiEdit2 size={16} />
                Edit
              </button>

              {/* DELETE CUSTOMER */}
              <button
                type="button"
                onClick={() => {
                  const confirmed = window.confirm(
                    "Are you sure you want to delete this customer?",
                  );

                  if (confirmed) {
                    navigate("/customers");
                  }
                }}
                className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
              >
                <FiTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL PROJECTS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Projects
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {totalProjects}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FiBriefcase size={18} />
              </div>
            </div>
          </div>

          {/* TOTAL BUSINESS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Business
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(totalBusiness)}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FaMoneyBillWave size={18} />
              </div>
            </div>
          </div>

          {/* PAID */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Paid Amount
                </p>

                <h2 className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(paidAmount)}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <FaMoneyBillWave size={18} />
              </div>
            </div>
          </div>

          {/* REMAINING */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Remaining
                </p>

                <h2 className="mt-2 text-2xl font-bold text-orange-500">
                  {formatCurrency(remainingAmount)}
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FaMoneyBillWave size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =================================================
              CUSTOMER INFORMATION
          ================================================= */}

          <div className="lg:col-span-1">
            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                  <FiUser size={17} />
                </div>

                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-5">
                <InfoItem label="Customer Name" value={customer.name} />

                <InfoItem label="Customer ID" value={customer.id} />

                <InfoItem label="Phone" value={customer.phone} />

                <InfoItem label="PAN / VAT Number" value={customer.pan} />

                <InfoItem label="Address" value={customer.address} />

                <InfoItem label="Status" value={customer.status} />
              </div>

              {/* CONTACT */}

              <div className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <FiMapPin size={16} />
                  {customer.address}
                </div>
              </div>
            </section>

            {/* CUSTOMER PAYMENT */}

            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                  <FaMoneyBillWave size={16} />
                </div>

                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Payment Summary
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total Business
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(totalBusiness)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Paid
                  </span>

                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Remaining
                    </span>

                    <span className="text-base font-bold text-orange-500">
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              PROJECT HISTORY
          ================================================= */}

          <div className="lg:col-span-2">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {/* HEADER */}

              <div className="border-b border-slate-200 p-5 dark:border-slate-800">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                        <FiFileText size={17} />
                      </div>

                      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                        Project History
                      </h2>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">
                      All projects created for this customer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/projects/create-project")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Create Project
                  </button>
                </div>

                {/* SEARCH + FILTER */}

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <FiSearch
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Printed">Printed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* PROJECT LIST */}

              <div>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      className="group flex w-full flex-col gap-4 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 last:border-b-0 dark:border-slate-800 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* PROJECT */}

                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition  dark:bg-orange-500/10">
                          <FiFileText size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 transition  dark:text-slate-200">
                            {project.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                            <span>{project.id}</span>

                            <span>•</span>

                            <span>{project.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* AMOUNT + STATUS */}

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {formatCurrency(project.amount)}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400 sm:justify-end">
                            <FiCalendar size={12} />
                            Due {project.dueDate}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[project.status]}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-16 text-center">
                    <FiFileText
                      size={40}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                      No projects found
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or status filter.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
