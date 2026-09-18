import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiPrinter } from "react-icons/fi";

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
      // Estimate Header
      slipNumber: "",
      date: "",
      customerName: "",
      panNumber: "",
      address: "",
      contactNumber: "",

      // Project Information
      projectName: "",
      customer: "",
      description: "",
      dueDate: "",
      priority: "Normal",

      // Printing Items
      items: [
        {
          description: "",
          quantity: 1,
          rate: 0,
          size: "",
          ink: "",
          paperType: "",
          bindingType: "",
          designDatePerson: "",
          printingDatePerson: "",
          bindingDatePerson: "",
          workType: "",
        },
      ],

      // Summary / Footer
      advance: "",
      printingDetails: "",
    },
  });

  // Watch all form data
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

  const advance = Number(formData.advance) || 0;
  const remainingAmount = totalAmount - advance;

  // ========================================
  // CREATE PROJECT
  // ========================================

  const onSubmit = (data) => {
    const projectData = {
      ...data,
      totalAmount,
    };

    console.log("Project Data:", projectData);

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
        {/* Page Header */}
        <div className="mx-auto mb-6 max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                Create Project
              </h1>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create a new printing estimate and project.
              </p>
            </div>

            {/* PRINT BUTTON */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <FiPrinter size={17} />
              Print
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl">
          {/* =====================================================
              ESTIMATE HEADER
          ====================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 bg-white px-6 py-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <span className="text-lg text-orange-600">#</span>
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                    Estimate Information
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
              PRINTING ITEMS
          ====================================================== */}

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                    Printing Items
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Add the products and printing details for this estimate.
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
              ESTIMATE SUMMARY
          ====================================================== */}

          <div className="mb-6">
            <EstimateSummary control={control} register={register} />
          </div>

          {/* =====================================================
              ESTIMATE FOOTER
          ====================================================== */}

          <div className="mb-6">
            <EstimateFooter register={register} />
          </div>

          {/* =====================================================
              TOTAL
          ====================================================== */}

          <div className="mb-6 flex justify-end">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:w-96">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Estimate Total
                </p>
              </div>

              <div className="flex items-center justify-between px-5 py-5">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Amount
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Including all printing items
                  </p>
                </div>

                <p className="text-2xl font-bold tracking-tight text-orange-600">
                  Rs. {totalAmount.toLocaleString("en-IN")}
                </p>
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
          This section is hidden on screen and shown only while
          printing.
      =========================================================== */}

      <div className="print-estimate">
        {/* PRINT HEADER */}

        <div className="print-header">
          <div className="print-logo-section">
            <img src={Logo} alt="PrintTech" className="print-logo" />
          </div>

          <div className="print-title-section">
            <h1>ESTIMATE SLIP</h1>

            <p>
              PPP No: <strong>{formData.slipNumber || "-"}</strong>
            </p>

            <p>
              मिति: <strong>{formData.date || "-"}</strong>
            </p>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}

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

        {/* PROJECT INFORMATION */}

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

        {/* PRINTING ITEMS */}

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

        {/* WORK DATES */}

        <div className="print-section">
          <h2>WORK SCHEDULE</h2>

          <table className="print-table schedule-table">
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Design</th>
                <th>Printing</th>
                <th>Binding</th>
              </tr>
            </thead>

            <tbody>
              {formData.items?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>{item.designDatePerson || "-"}</td>

                  <td>{item.printingDatePerson || "-"}</td>

                  <td>{item.bindingDatePerson || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DESCRIPTION */}

        <div className="print-section">
          <h2>छपाइको पुर्ण बीवरण :</h2>

          <div className="printing-description">
            {formData.printingDetails || formData.description || "-"}
          </div>
        </div>

        {/* SUMMARY */}

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
                <td>सामान दिने मिति</td>
                <td>{formData.dueDate || "-"}</td>
              </tr>

              <tr>
                <td>रकम चुक्ता गर्ने मिति</td>
                <td>{formData.paymentDate || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SIGNATURE */}

        <div className="print-signatures">
          <div>
            <div className="signature-line"></div>
            <p>Customer Signature</p>
          </div>

          <div>
            <div className="signature-line"></div>
            <p>Authorized Signature</p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="print-footer">
          <p>PrintTech Printing Press</p>
          <p>Thank you for your business.</p>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
