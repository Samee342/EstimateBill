import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiEdit,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiPrinter,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import { FaMoneyBillWave } from "react-icons/fa";

// ======================================================
// TEMPORARY PROJECT DATA
// Later this will come from your backend
// ======================================================

const projects = [
  {
    id: "PRJ-1001",
    estimateNo: "EST-10245",
    name: "Business Card Printing",

    customer: {
      name: "Ram Sharma",
      phone: "9841234567",
      address: "Butwal, Rupandehi",
      pan: "609874321",
    },

    date: "2026-09-07",
    dueDate: "2026-09-10",
    priority: "Normal",
    status: "Completed",

    totalAmount: 12500,
    advance: 5000,
    remaining: 7500,

    paymentStatus: "Partial",

    items: [
      {
        description: "Business Card",
        quantity: 500,
        size: "3.5 x 2 inch",
        paperType: "300 GSM Art Card",
        ink: "4 Color",
        rate: 25,
        total: 12500,
        bindingType: "-",
        workType: "Printing",
      },
    ],

    production: {
      designDate: "2026-09-07",
      designPerson: "Aashish",
      printingDate: "2026-09-08",
      printingPerson: "Ram",
      bindingDate: "-",
      bindingPerson: "-",
    },

    description: "Business cards printed for company staff and management.",
  },

  {
    id: "PRJ-1002",
    estimateNo: "EST-10246",
    name: "Wedding Invitation Cards",

    customer: {
      name: "Sita Karki",
      phone: "9812345678",
      address: "Bhairahawa, Rupandehi",
      pan: "601234567",
    },

    date: "2026-09-07",
    dueDate: "2026-09-15",
    priority: "High",
    status: "Pending",

    totalAmount: 18750,
    advance: 8000,
    remaining: 10750,

    paymentStatus: "Partial",

    items: [
      {
        description: "Wedding Invitation Card",
        quantity: 750,
        size: "5 x 7 inch",
        paperType: "250 GSM Textured",
        ink: "4 Color",
        rate: 25,
        total: 18750,
        bindingType: "Folding",
        workType: "Printing + Finishing",
      },
    ],

    production: {
      designDate: "2026-09-08",
      designPerson: "Suman",
      printingDate: "2026-09-12",
      printingPerson: "Ram",
      bindingDate: "2026-09-13",
      bindingPerson: "Hari",
    },

    description: "Wedding invitation cards with custom design and folding.",
  },

  {
    id: "PRJ-1003",
    estimateNo: "EST-10247",
    name: "Restaurant Menu Printing",

    customer: {
      name: "Hari Thapa",
      phone: "9867890123",
      address: "Nepalgunj, Banke",
      pan: "608765432",
    },

    date: "2026-09-06",
    dueDate: "2026-09-12",
    priority: "Normal",
    status: "Printed",

    totalAmount: 24300,
    advance: 10000,
    remaining: 14300,

    paymentStatus: "Partial",

    items: [
      {
        description: "Restaurant Menu",
        quantity: 100,
        size: "A4",
        paperType: "300 GSM Art Card",
        ink: "4 Color",
        rate: 243,
        total: 24300,
        bindingType: "Lamination",
        workType: "Printing + Finishing",
      },
    ],

    production: {
      designDate: "2026-09-06",
      designPerson: "Suman",
      printingDate: "2026-09-08",
      printingPerson: "Ram",
      bindingDate: "2026-09-09",
      bindingPerson: "Hari",
    },

    description: "Premium restaurant menu printing with laminated finishing.",
  },

  {
    id: "PRJ-1004",
    estimateNo: "EST-10248",
    name: "Flex Banner Design",

    customer: {
      name: "Aashish Gurung",
      phone: "9801234567",
      address: "Butwal, Rupandehi",
      pan: "605432198",
    },

    date: "2026-09-06",
    dueDate: "2026-09-11",
    priority: "High",
    status: "Pending",

    totalAmount: 5600,
    advance: 2000,
    remaining: 3600,

    paymentStatus: "Partial",

    items: [
      {
        description: "Promotional Flex Banner",
        quantity: 4,
        size: "4 x 8 ft",
        paperType: "Flex",
        ink: "Eco Solvent",
        rate: 1400,
        total: 5600,
        bindingType: "Eyelet",
        workType: "Design + Printing",
      },
    ],

    production: {
      designDate: "2026-09-07",
      designPerson: "Aashish",
      printingDate: "2026-09-09",
      printingPerson: "Ram",
      bindingDate: "2026-09-10",
      bindingPerson: "Hari",
    },

    description: "Large promotional flex banners for outdoor advertising.",
  },

  {
    id: "PRJ-1005",
    estimateNo: "EST-10249",
    name: "Company Brochure",

    customer: {
      name: "Mina Rai",
      phone: "9823456789",
      address: "Kohalpur, Banke",
      pan: "607654321",
    },

    date: "2026-09-05",
    dueDate: "2026-09-14",
    priority: "Normal",
    status: "Completed",

    totalAmount: 18900,
    advance: 9000,
    remaining: 9900,

    paymentStatus: "Partial",

    items: [
      {
        description: "Company Brochure",
        quantity: 300,
        size: "A4",
        paperType: "130 GSM Glossy",
        ink: "4 Color",
        rate: 63,
        total: 18900,
        bindingType: "Center Pin",
        workType: "Printing + Binding",
      },
    ],

    production: {
      designDate: "2026-09-06",
      designPerson: "Suman",
      printingDate: "2026-09-08",
      printingPerson: "Ram",
      bindingDate: "2026-09-10",
      bindingPerson: "Hari",
    },

    description: "Corporate brochure with professional full-color printing.",
  },

  {
    id: "PRJ-1006",
    estimateNo: "EST-10250",
    name: "Product Label Printing",

    customer: {
      name: "Everest Traders",
      phone: "9856789012",
      address: "Nepalgunj, Banke",
      pan: "604321987",
    },

    date: "2026-09-04",
    dueDate: "2026-09-13",
    priority: "High",
    status: "Printed",

    totalAmount: 32500,
    advance: 15000,
    remaining: 17500,

    paymentStatus: "Partial",

    items: [
      {
        description: "Product Labels",
        quantity: 2500,
        size: "3 x 4 inch",
        paperType: "Sticker Paper",
        ink: "4 Color",
        rate: 13,
        total: 32500,
        bindingType: "-",
        workType: "Printing",
      },
    ],

    production: {
      designDate: "2026-09-05",
      designPerson: "Aashish",
      printingDate: "2026-09-08",
      printingPerson: "Ram",
      bindingDate: "-",
      bindingPerson: "-",
    },

    description: "Product labels for retail packaging and branding.",
  },

  {
    id: "PRJ-1007",
    estimateNo: "EST-10251",
    name: "Office Letterhead",

    customer: {
      name: "ABC Enterprises",
      phone: "9811122233",
      address: "Butwal, Rupandehi",
      pan: "601122334",
    },

    date: "2026-09-03",
    dueDate: "2026-09-09",
    priority: "Normal",
    status: "Pending",

    totalAmount: 7800,
    advance: 3000,
    remaining: 4800,

    paymentStatus: "Partial",

    items: [
      {
        description: "Office Letterhead",
        quantity: 1000,
        size: "A4",
        paperType: "100 GSM Offset",
        ink: "4 Color",
        rate: 7.8,
        total: 7800,
        bindingType: "-",
        workType: "Printing",
      },
    ],

    production: {
      designDate: "2026-09-04",
      designPerson: "Suman",
      printingDate: "2026-09-06",
      printingPerson: "Ram",
      bindingDate: "-",
      bindingPerson: "-",
    },

    description: "Official company letterheads with branded header and footer.",
  },

  {
    id: "PRJ-1008",
    estimateNo: "EST-10252",
    name: "Promotional Posters",

    customer: {
      name: "New Star Hotel",
      phone: "9845678901",
      address: "Nepalgunj, Banke",
      pan: "603456789",
    },

    date: "2026-09-02",
    dueDate: "2026-09-08",
    priority: "Normal",
    status: "Completed",

    totalAmount: 15400,
    advance: 15400,
    remaining: 0,

    paymentStatus: "Paid",

    items: [
      {
        description: "Promotional Poster",
        quantity: 200,
        size: "A3",
        paperType: "170 GSM Glossy",
        ink: "4 Color",
        rate: 77,
        total: 15400,
        bindingType: "-",
        workType: "Printing",
      },
    ],

    production: {
      designDate: "2026-09-03",
      designPerson: "Aashish",
      printingDate: "2026-09-05",
      printingPerson: "Ram",
      bindingDate: "-",
      bindingPerson: "-",
    },

    description: "Promotional posters for hotel marketing campaign.",
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
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",

  Printed:
    "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",

  Completed:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

// ======================================================
// SMALL COMPONENTS
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

const SectionTitle = ({ icon: Icon, title }) => {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10">
        <Icon size={17} />
      </div>

      <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h2>
    </div>
  );
};

// ======================================================
// PAGE
// ======================================================

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find(
    (projectItem) => projectItem.id.toLowerCase() === id?.toLowerCase(),
  );

  // ====================================================
  // PROJECT NOT FOUND
  // ====================================================

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-500 dark:text-slate-400"
          >
            <FiArrowLeft size={17} />
            Back to Projects
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <FiFileText size={24} />
            </div>

            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Project Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No project was found with ID{" "}
              <span className="font-semibold">{id}</span>.
            </p>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================================================
            TOP BAR
        ================================================= */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-500 dark:text-slate-400"
          >
            <FiArrowLeft size={17} />
            Back to Projects
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
                <FiFileText size={22} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {project.name}
                  </h1>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span>{project.id}</span>

                  <span className="text-slate-300 dark:text-slate-700">•</span>

                  <span>{project.estimateNo}</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2">
              {/* DELETE */}

              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
              >
                <FiTrash2 size={16} />
                Delete Project
              </button>
            </div>
          </div>
        </div>

        {/* ================================================
            SUMMARY
        ================================================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Amount
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(project.totalAmount)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Advance Paid
            </p>

            <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(project.advance)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Remaining
            </p>

            <p className="mt-2 text-xl font-bold text-orange-500">
              {formatCurrency(project.remaining)}
            </p>
          </div>
        </div>

        {/* ================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ==============================================
              LEFT / MAIN CONTENT
          =============================================== */}

          <div className="space-y-6 lg:col-span-2">
            {/* CUSTOMER */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiUser} title="Customer Information" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoItem label="Customer Name" value={project.customer.name} />

                <InfoItem label="Phone" value={project.customer.phone} />

                <InfoItem label="Address" value={project.customer.address} />

                <InfoItem label="PAN / VAT" value={project.customer.pan} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <FiMapPin size={14} />
                  {project.customer.address}
                </div>
              </div>
            </section>

            {/* PROJECT INFORMATION */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiCalendar} title="Project Information" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <InfoItem label="Estimate No." value={project.estimateNo} />

                <InfoItem label="Project Date" value={project.date} />

                <InfoItem label="Due Date" value={project.dueDate} />

                <InfoItem label="Priority" value={project.priority} />

                <InfoItem label="Status" value={project.status} />

                <InfoItem label="Payment" value={project.paymentStatus} />
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Description
                </p>

                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {project.description}
                </p>
              </div>
            </section>

            {/* PRINTING ITEMS */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiPrinter} title="Printing Items" />

              {/* Desktop */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Description
                      </th>

                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Qty
                      </th>

                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Size
                      </th>

                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Paper
                      </th>

                      <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ink
                      </th>

                      <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {project.items.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-50 last:border-0 dark:border-slate-800"
                      >
                        <td className="px-3 py-4">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {item.description}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.workType}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {item.quantity}
                        </td>

                        <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {item.size}
                        </td>

                        <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {item.paperType}
                        </td>

                        <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {item.ink}
                        </td>

                        <td className="px-3 py-4 text-right text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}

              <div className="space-y-3 md:hidden">
                {project.items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-100 p-4 dark:border-slate-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.description}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {item.workType}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-orange-500">
                        {formatCurrency(item.total)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <InfoItem label="Quantity" value={item.quantity} />

                      <InfoItem label="Size" value={item.size} />

                      <InfoItem label="Paper" value={item.paperType} />

                      <InfoItem label="Ink" value={item.ink} />

                      <InfoItem label="Binding" value={item.bindingType} />

                      <InfoItem
                        label="Rate"
                        value={formatCurrency(item.rate)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PRODUCTION */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiClock} title="Production Timeline" />

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-orange-500 ring-4 ring-orange-50 dark:ring-orange-500/10" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Design
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {project.production.designDate}
                    </p>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Responsible:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {project.production.designPerson}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-500/10" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Printing
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {project.production.printingDate}
                    </p>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Responsible:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {project.production.printingPerson}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-500/10" />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Binding / Finishing
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {project.production.bindingDate}
                    </p>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Responsible:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {project.production.bindingPerson}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ==============================================
              RIGHT SIDEBAR
          =============================================== */}

          <div className="space-y-6">
            {/* PAYMENT */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FaMoneyBillWave} title="Payment Summary" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total Amount
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(project.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Advance
                  </span>

                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(project.advance)}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Remaining
                    </span>

                    <span className="text-base font-bold text-orange-500">
                      {formatCurrency(project.remaining)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Payment Status</p>

                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {project.paymentStatus}
                </p>
              </div>
            </section>

            {/* DATES */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiCalendar} title="Important Dates" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Project Date</p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {project.date}
                    </p>
                  </div>

                  <FiCalendar className="text-slate-400" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Delivery Date</p>

                    <p className="mt-1 text-sm font-semibold text-orange-500">
                      {project.dueDate}
                    </p>
                  </div>

                  <FiClock className="text-orange-500" />
                </div>
              </div>
            </section>

            {/* CUSTOMER QUICK INFO */}

            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <SectionTitle icon={FiUser} title="Customer" />

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-500 dark:bg-orange-500/10">
                  {project.customer.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {project.customer.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {project.customer.phone}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/customers")}
                className="mt-5 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300"
              >
                View Customer
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
