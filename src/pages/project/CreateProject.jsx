import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  FiPrinter,
  FiUser,
  FiBriefcase,
  FiCreditCard,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

import EstimateHeader from "../../components/EstimateHeader";
import EstimateItems from "../../components/EstimateItems";
import EstimateSummary from "../../components/EstimateSummary";
import EstimateFooter from "../../components/EstimateFooter";

import Logo from "../../assets/Logo.png";

const CreateProject = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // ========================================
      // CUSTOMER / ESTIMATE INFORMATION
      // ========================================
      slipNumber: "",
      date: new Date().toISOString().split("T")[0],
      customerName: "",
      panNumber: "",
      address: "",
      contactNumber: "",

      // ========================================
      // PROJECT / ORDER INFORMATION
      // ========================================
      projectName: "",
      customer: "",
      description: "",
      dueDate: "",
      priority: "Normal",

      // ========================================
      // PRINTING ITEMS
      // ========================================
      items: [
        {
          description: "",
          quantity: 1,
          rate: 0,
          size: "",
          ink: "",
          paperType: "",
          bindingType: "",
          workType: "",
        },
      ],

      // ========================================
      // PAYMENT
      // ========================================
      advance: "",
      paymentDate: "",
      paymentMethod: "Cash",
      paymentStatus: "Unpaid",

      // ========================================
      // FOOTER / NOTES
      // ========================================
      printingDetails: "",
    },
  });

  // ========================================
  // WATCH FORM DATA
  // ========================================

  const formData = watch();
  const items = watch("items");

  // ========================================
  // CALCULATE TOTAL
  // ========================================

  const totalAmount =
    items?.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;

      return total + quantity * rate;
    }, 0) || 0;

  // ========================================
  // PAYMENT CALCULATION
  // ========================================

  const advance = Number(formData.advance) || 0;

  const remainingAmount = Math.max(totalAmount - advance, 0);

  // ========================================
  // CREATE PROJECT
  // ========================================

  const onSubmit = (data) => {
    const projectData = {
      ...data,

      // Financial information
      totalAmount,
      advance,
      remainingAmount,

      // Project information
      status: "Draft",

      // Created date
      createdAt: new Date().toISOString(),
    };

    console.log("Project Data:", projectData);

    /*
      Later backend/localStorage mein projectData save hoga.

      Example structure:

      {
        projectName,
        customerName,
        contactNumber,
        items,
        totalAmount,
        advance,
        remainingAmount,
        paymentMethod,
        paymentStatus,
        status
      }
    */

    alert("Project created successfully!");

    navigate("/projects");
  };

  // ========================================
  // PRINT
  // ========================================

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* =====================================================
          SCREEN VERSION
      ====================================================== */}

      <div className="no-print min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-700 sm:px-6 lg:px-8">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mx-auto mb-6 max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                Create Project
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create customer order, estimate and payment details.
              </p>
            </div>

            {/* PRINT BUTTON */}

            <button
              type="button"
              onClick={handlePrint}
              className="flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <FiPrinter size={17} />
              Print Estimate
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl">
          {/* =====================================================
              01. CUSTOMER INFORMATION
          ====================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <FiUser className="text-orange-600" size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                    01. Customer Information
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter customer and estimate details.
                  </p>
                </div>
              </div>
            </div>

            <EstimateHeader
              register={register}
              errors={errors}
              setValue={setValue}
            />
          </div>

          {/* =====================================================
              02. PROJECT / ORDER INFORMATION
          ====================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <FiBriefcase className="text-orange-600" size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                    02. Project / Order Information
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the main details of this customer order.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              {/* PROJECT NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project Name
                </label>

                <input
                  type="text"
                  placeholder="Example: Wedding Cards"
                  {...register("projectName")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* CUSTOMER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Customer
                </label>

                <input
                  type="text"
                  placeholder="Customer name"
                  {...register("customer")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* DUE DATE */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <FiCalendar size={15} />
                  Due Date
                </label>

                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* PRIORITY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Priority
                </label>

                <select
                  {...register("priority")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <FiFileText size={15} />
                  Order Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Describe customer order..."
                  {...register("description")}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              03. PRINTING ITEMS
          ====================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                    03. Printing Items
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Add products and printing details for this order.
                  </p>
                </div>

                <div className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600">
                  {items?.length || 0} {items?.length === 1 ? "Item" : "Items"}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <EstimateItems control={control} register={register} />
            </div>
          </div>

          {/* =====================================================
              04. ESTIMATE SUMMARY
          ====================================================== */}

          <div className="mb-6">
            <EstimateSummary control={control} register={register} />
          </div>

          {/* =====================================================
              05. PAYMENT INFORMATION
          ====================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <FiCreditCard className="text-orange-600" size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                    05. Payment Information
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Record advance payment and payment status.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
              {/* TOTAL */}

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Amount
                </p>

                <p className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
                  Rs. {totalAmount.toLocaleString("en-IN")}
                </p>
              </div>

              {/* ADVANCE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Advance Payment
                </label>

                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  placeholder="0"
                  {...register("advance")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* REMAINING */}

              <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
                <p className="text-xs font-medium uppercase tracking-wide text-orange-500">
                  Remaining
                </p>

                <p className="mt-2 text-xl font-bold text-orange-600">
                  Rs. {remainingAmount.toLocaleString("en-IN")}
                </p>
              </div>

              {/* PAYMENT METHOD */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Payment Method
                </label>

                <select
                  {...register("paymentMethod")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                </select>
              </div>

              {/* PAYMENT STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Payment Status
                </label>

                <select
                  {...register("paymentStatus")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* PAYMENT DATE */}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <FiCalendar size={15} />
                  Payment Date
                </label>

                <input
                  type="date"
                  {...register("paymentDate")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              06. NOTES / FOOTER
          ====================================================== */}

          <div className="mb-6">
            <EstimateFooter register={register} />
          </div>

          {/* =====================================================
              07. FINAL TOTAL
          ====================================================== */}

          <div className="mb-6 flex justify-end">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:w-96">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Estimate Summary
                </p>
              </div>

              <div className="space-y-3 px-5 py-5">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Total
                  </span>

                  <span className="font-semibold text-slate-800 dark:text-white">
                    Rs. {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Advance
                  </span>

                  <span className="font-semibold text-slate-800 dark:text-white">
                    Rs. {advance.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Remaining
                    </span>

                    <span className="text-xl font-bold text-orange-600">
                      Rs. {remainingAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              ACTIONS
          ====================================================== */}

          <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
            >
              <FiPrinter size={16} />
              Print Estimate
            </button>

            <button
              type="submit"
              className="rounded-xl bg-orange-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 hover:shadow-md"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>

      {/* ==========================================================
          PRINT VERSION
      =========================================================== */}

      <div className="print-estimate">
        {/* PRINT HEADER */}

        <div className="print-header">
          <div className="print-title-section">
            <h1 className="text-center">ESTIMATE SLIP</h1>

            <p>
              PPP No: <strong>{formData.slipNumber || "-"}</strong>
            </p>

            <p>
              मिति: <strong>{formData.date || "-"}</strong>
            </p>
          </div>
        </div>

        {/* =====================================================
            CUSTOMER INFORMATION
        ====================================================== */}

        <div className="print-section">
          <h2>CUSTOMER INFORMATION</h2>

          <div className="customer-grid">
            <div>
              <strong>Customer Name:</strong> {formData.customerName || "-"}
            </div>

            <div>
              <strong>Contact:</strong> {formData.contactNumber || "-"}
            </div>

            <div>
              <strong>PAN/VAT No:</strong> {formData.panNumber || "-"}
            </div>

            <div>
              <strong>Project:</strong> {formData.projectName || "-"}
            </div>

            <div className="full-width">
              <strong>Address:</strong> {formData.address || "-"}
            </div>
          </div>
        </div>

        {/* =====================================================
            PROJECT INFORMATION
        ====================================================== */}

        <div className="print-section">
          <h2>PROJECT INFORMATION</h2>

          <div className="customer-grid">
            <div>
              <strong>Project Name:</strong> {formData.projectName || "-"}
            </div>

            <div>
              <strong>Priority:</strong> {formData.priority || "-"}
            </div>

            <div>
              <strong>Due Date:</strong> {formData.dueDate || "-"}
            </div>

            <div>
              <strong>Customer:</strong> {formData.customer || "-"}
            </div>

            <div className="full-width">
              <strong>Description:</strong> {formData.description || "-"}
            </div>
          </div>
        </div>

        {/* =====================================================
            PRINTING ITEMS
        ====================================================== */}

        <div className="print-section">
          <h2>PRINTING DETAILS</h2>

          <table className="print-table">
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Description</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Ink</th>
                <th>Paper</th>
                <th>Binding</th>
                <th>Work Type</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {formData.items?.map((item, index) => {
                const quantity = Number(item.quantity) || 0;

                const rate = Number(item.rate) || 0;

                const amount = quantity * rate;

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.description || "-"}</td>

                    <td>{item.size || "-"}</td>

                    <td>{quantity}</td>

                    <td>Rs. {rate.toLocaleString("en-IN")}</td>

                    <td>{item.ink || "-"}</td>

                    <td>{item.paperType || "-"}</td>

                    <td>{item.bindingType || "-"}</td>

                    <td>{item.workType || "-"}</td>

                    <td>Rs. {amount.toLocaleString("en-IN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PRINTING NOTES
        ====================================================== */}

        <div className="print-section">
          <h2>छपाइको पुर्ण बीवरण :</h2>

          <div className="printing-description">
            {formData.printingDetails || formData.description || "-"}
          </div>
        </div>

        {/* =====================================================
            PAYMENT INFORMATION
        ====================================================== */}

        <div className="print-section">
          <h2>PAYMENT INFORMATION</h2>

          <div className="customer-grid">
            <div>
              <strong>Payment Method:</strong> {formData.paymentMethod || "-"}
            </div>

            <div>
              <strong>Payment Status:</strong> {formData.paymentStatus || "-"}
            </div>

            <div>
              <strong>Payment Date:</strong> {formData.paymentDate || "-"}
            </div>

            <div>
              <strong>Due Date:</strong> {formData.dueDate || "-"}
            </div>
          </div>
        </div>

        {/* =====================================================
            PAYMENT SUMMARY
        ====================================================== */}

        <div className="print-summary-wrapper">
          <table className="print-summary">
            <tbody>
              <tr>
                <td>जम्मा रकम</td>

                <td>Rs. {totalAmount.toLocaleString("en-IN")}</td>
              </tr>

              <tr>
                <td>पेस्की</td>

                <td>Rs. {advance.toLocaleString("en-IN")}</td>
              </tr>

              <tr>
                <td>बाँकी</td>

                <td>Rs. {remainingAmount.toLocaleString("en-IN")}</td>
              </tr>

              <tr>
                <td>Payment Method</td>

                <td>{formData.paymentMethod || "-"}</td>
              </tr>

              <tr>
                <td>Payment Status</td>

                <td>{formData.paymentStatus || "-"}</td>
              </tr>

              <tr>
                <td>सामान दिने मिति</td>

                <td>{formData.dueDate || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div className="print-footer">
          <p>PrintTech Printing Press</p>

          <p>Thank you for your business.</p>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
