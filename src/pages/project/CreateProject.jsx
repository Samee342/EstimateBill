import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import EstimateHeader from "../../components/EstimateHeader";
import EstimateItems from "../../components/EstimateItems";
import EstimateSummary from "../../components/EstimateSummary";
import EstimateFooter from "../../components/EstimateFooter";

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
    },
  });

  const items = watch("items");

  // Calculate total
  const totalAmount =
    items?.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;

      return total + quantity * rate;
    }, 0) || 0;

  const onSubmit = (data) => {
    const projectData = {
      ...data,
      totalAmount,
    };

    console.log("Project Data:", projectData);

    alert("Project created successfully!");

    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-700 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mx-auto mb-6 max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
              Create Project
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new printing estimate and project.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="w-fit rounded-lg border border-slate-200  bg-white dark:bg-slate-600 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            ← Back to Projects
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl">
        {/* =========================================
            ESTIMATE HEADER
        ========================================== */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 shadow-sm">
          <div className="border-b border-slate-100 bg-white dark:bg-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                <span className="text-lg text-orange-600">#</span>
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                  Estimate Information
                </h2>

                <p className="text-xs text-slate-500">
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

        {/* =========================================
            PRINTING ITEMS
        ========================================== */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                  Printing Items
                </h2>

                <p className="mt-1 text-xs text-slate-500">
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

        {/* =========================================
            ESTIMATE SUMMARY
        ========================================== */}
        <div className="mb-6">
          <EstimateSummary control={control} register={register} />
        </div>

        <div className="mb-6">
          <EstimateFooter register={register} />
        </div>

        {/* =========================================
            TOTAL
        ========================================== */}
        <div className="mb-6 flex justify-end">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 shadow-sm sm:w-96">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Estimate Total
              </p>
            </div>

            <div className="flex items-center justify-between px-5 py-5">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Amount
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Including all printing items
                </p>
              </div>

              <p className="text-2xl font-bold tracking-tight text-orange-600">
                Rs. {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* =========================================
            ACTIONS
        ========================================== */}
        <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="rounded-xl border border-slate-200 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
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
  );
};

export default CreateProject;
