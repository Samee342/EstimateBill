import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiUser, FiBriefcase, FiCreditCard, FiCalendar } from "react-icons/fi";
import EstimateHeader from "../../../components/EstimateHeader";
import EstimateItems from "../../../components/EstimateItems";
import EstimateSummary from "../../../components/EstimateSummary";
import EstimateFooter from "../../../components/EstimateFooter";
import { Controller } from "react-hook-form";
import {
  NepaliDatePicker,
  makeDualDateValueFromAd,
} from "@etpl/nepali-datepicker";
import toast from "react-hot-toast";
import api from "../../../api/api";
import {
  createProject,
  getProjects,
  updateProject,
  addItems,
  getItems,
  createAmount,
} from "../../../api/project";

const emptyItem = {
  item_description: "",
  quantity: 1,
  rate: 0,
  size: "",
  maso: "",
  paper_type: "",
  band_type: "",
  Designing_person: "",
  printing_person: "",
  binding_person: "",
  work_type: "",
};

const getList = (response) => {
  const data = response?.data?.data ?? response?.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.projects)) return data.projects;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getRelatedId = (value) => {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    return value.id ?? value.uuid ?? value.pk ?? "";
  }

  return value;
};

// Safely turn a delivery_date value into a display string.
// Handles DualDateValue objects, ISO strings, and null/undefined.
const formatDueDateForDisplay = (value) => {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return value?.formatted?.ad || value?.formatted?.bs || "-";
};

const CreateProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  const [loadingExistingProject, setLoadingExistingProject] = useState(false);
  const [existingItems, setExistingItems] = useState([]);
  const [savedProjectId, setSavedProjectId] = useState(null);
  const [justCreated, setJustCreated] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      slip_no: "",
      slip_date: new Date().toISOString().split("T")[0],

      customer: "",
      customerName: "",
      panNumber: "",
      address: "",
      contactNumber: "",

      project_name: "",
      description: "",
      delivery_date: null,
      priority: "normal",
      work_status: "pending",

      items: [{ ...emptyItem }],

      advance: 0,
      paymentDate: "",
      paymentMethod: "Cash",
      paymentStatus: "Unpaid",

      printingDetails: "",
    },
  });

  const formData = watch();
  const selectedCustomerId = watch("customer");
  const items = watch("items") || [];

  // --------------------------------------------------
  // CALCULATE TOTALS
  // --------------------------------------------------

  const totalAmount = items.reduce((total, item) => {
    const quantity = Number(item?.quantity) || 0;
    const rate = Number(item?.rate) || 0;

    return total + quantity * rate;
  }, 0);

  const advance = Math.max(0, Number(formData.advance) || 0);
  const remainingAmount = Math.max(totalAmount - advance, 0);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // --------------------------------------------------
  // ERROR HANDLER
  // --------------------------------------------------

  const getErrorMessage = (error) => {
    const backendError = error?.response?.data;

    if (typeof backendError === "string") {
      return backendError;
    }

    if (backendError?.detail) {
      return backendError.detail;
    }

    if (backendError?.message) {
      return backendError.message;
    }

    if (backendError && typeof backendError === "object") {
      return Object.entries(backendError)
        .map(([field, value]) => {
          const message = Array.isArray(value)
            ? value.join(", ")
            : typeof value === "object" && value !== null
              ? JSON.stringify(value)
              : String(value);

          return `${field}: ${message}`;
        })
        .join("\n");
    }

    return error?.message || "Failed to save project.";
  };

  // --------------------------------------------------
  // RESPONSE HELPERS
  // --------------------------------------------------

  const getProjectId = (response) => {
    const result = response?.data ?? response;

    return (
      result?.id ??
      result?.order?.id ??
      result?.current_order?.id ??
      result?.current_order?.order?.id ??
      null
    );
  };

  const getSlipNumber = (response) => {
    const result = response?.data ?? response;

    return (
      result?.slip_no ??
      result?.slip_number ??
      result?.current_order?.slip_no ??
      result?.current_order?.slip_number ??
      result?.order?.slip_no ??
      result?.order?.slip_number ??
      ""
    );
  };

  // --------------------------------------------------
  // LOAD EXISTING PROJECT FOR EDITING
  // --------------------------------------------------

  useEffect(() => {
    if (!isEditMode) return;

    let cancelled = false;

    const loadExistingProject = async () => {
      try {
        setLoadingExistingProject(true);

        const [projectsResponse, itemsResponse] = await Promise.all([
          getProjects(),
          getItems(),
        ]);

        if (cancelled) return;

        const projects = getList(projectsResponse);
        const allItems = getList(itemsResponse);

        const project = projects.find(
          (item) => String(item.id) === String(editId),
        );

        if (!project) {
          toast.error("Project not found.");
          navigate("/projects");
          return;
        }

        const customer =
          project.customer_details ??
          project.customer ??
          project.customer_info ??
          {};

        const customerId = getRelatedId(
          project.customer_details?.id ??
            project.customer_details?.uuid ??
            project.customer,
        );

        const projectItems = allItems.filter((item) => {
          const itemOrderId = getRelatedId(
            item.order ?? item.order_id ?? item.orderslip,
          );

          return String(itemOrderId) === String(project.id);
        });

        const normalizedItems = projectItems.map((item) => ({
          _apiId: item.id,
          item_description: item.item_description ?? item.description ?? "",
          quantity: Number(item.quantity) || 1,
          rate: Number(item.rate) || 0,
          size: item.size ?? "",
          maso: item.maso ?? "",
          paper_type: item.paper_type ?? "",
          band_type: item.band_type ?? "",
          Designing_person: getRelatedId(item.Designing_person) || "",
          printing_person: getRelatedId(item.printing_person) || "",
          binding_person: getRelatedId(item.binding_person) || "",
          work_type: item.work_type ?? "",
        }));

        setExistingItems(normalizedItems);

        reset({
          slip_no: String(project.slip_no ?? project.slip_number ?? ""),
          slip_date: String(project.slip_date ?? "").split("T")[0],

          customer: customerId,
          customerName:
            customer?.name ??
            project.customer_name ??
            project.customerName ??
            "",
          panNumber: customer?.pan_no ?? project.pan_no ?? "",
          address: customer?.address ?? project.address ?? "",
          contactNumber: customer?.contact_no ?? project.contact_no ?? "",

          project_name: project.project_name ?? project.name ?? "",
          description: project.description ?? "",
          delivery_date: project.delivery_date
            ? makeDualDateValueFromAd(new Date(project.delivery_date))
            : null,
          priority: project.priority ?? "normal",
          work_status:
            project.work_stage ??
            project.work_status ??
            project.status ??
            "pending",

          items:
            normalizedItems.length > 0 ? normalizedItems : [{ ...emptyItem }],

          advance: 0,
          paymentDate: "",
          paymentMethod: "Cash",
          paymentStatus: "Unpaid",

          printingDetails:
            project.printingDetails ?? project.printing_details ?? "",
        });

        console.log("Loaded project for editing:", project);
        console.log("Loaded project items:", normalizedItems);
      } catch (error) {
        console.error("Failed to load project for editing:", error);
        toast.error(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setLoadingExistingProject(false);
        }
      }
    };

    loadExistingProject();

    return () => {
      cancelled = true;
    };
  }, [editId, isEditMode, navigate, reset]);

  // --------------------------------------------------
  // CREATE OR UPDATE PROJECT
  // --------------------------------------------------

  const onSubmit = async (data) => {
    let projectSaved = false;

    try {
      const itemsToSave = (data.items || []).filter(
        (item) => String(item?.item_description || "").trim() !== "",
      );

      if (itemsToSave.length === 0) {
        toast.error("Please add at least one printing item.");
        return;
      }

      const calculatedTotal = itemsToSave.reduce((total, item) => {
        return total + (Number(item.quantity) || 0) * (Number(item.rate) || 0);
      }, 0);

      const paymentAdvance = Number(data.advance) || 0;

      if (paymentAdvance < 0) {
        toast.error("Advance payment cannot be negative.");
        return;
      }

      if (paymentAdvance > calculatedTotal) {
        toast.error("Advance cannot exceed the total amount.");
        return;
      }

      if (!data.customer) {
        toast.error("Please select a customer.");
        return;
      }

      const projectPayload = {
        slip_date: data.slip_date,
        customer: data.customer,
        project_name: String(data.project_name || "").trim(),
        description: data.description || "",
        delivery_date: data.delivery_date?.formatted?.ad || null,
        priority: data.priority || "normal",
        work_stage: String(data.work_status || "pending")
          .toLowerCase()
          .trim(),
      };

      Object.keys(projectPayload).forEach((key) => {
        if (projectPayload[key] === undefined || projectPayload[key] === "") {
          delete projectPayload[key];
        }
      });

      let projectId;

      // ================================================
      // EDIT EXISTING PROJECT
      // ================================================

      if (isEditMode) {
        projectId = editId;

        await updateProject(projectId, projectPayload);

        projectSaved = true;

        const submittedExistingIds = itemsToSave
          .map((item) => item._apiId)
          .filter(Boolean)
          .map(String);

        const removedItems = existingItems.filter(
          (item) => !submittedExistingIds.includes(String(item._apiId)),
        );

        for (const item of removedItems) {
          await api.delete(`/orderslipapi/slipitems/${item._apiId}/`);
        }

        for (const item of itemsToSave) {
          const quantity = Number(item.quantity);
          const rate = Number(item.rate);

          if (!Number.isFinite(quantity) || quantity <= 0) {
            throw new Error(`Invalid quantity for "${item.item_description}".`);
          }

          if (!Number.isFinite(rate) || rate < 0) {
            throw new Error(`Invalid rate for "${item.item_description}".`);
          }

          const itemPayload = {
            order: projectId,
            item_description: String(item.item_description).trim(),
            quantity,
            rate,
            size: item.size || "",
            maso: item.maso || "",
            paper_type: item.paper_type || "",
            band_type: item.band_type || "",
            Designing_person: item.Designing_person || null,
            printing_person: item.printing_person || null,
            binding_person: item.binding_person || null,
            work_type: item.work_type || "",
          };

          if (item._apiId) {
            await api.patch(
              `/orderslipapi/slipitems/${item._apiId}/`,
              itemPayload,
            );
          } else {
            await addItems(itemPayload);
          }
        }

        toast.success("Project updated successfully.");
        navigate("/projects");
        return;
      }

      // ================================================
      // CREATE NEW PROJECT
      // ================================================

      const projectResponse = await createProject(projectPayload);

      projectId = getProjectId(projectResponse);

      const generatedSlipNumber = getSlipNumber(projectResponse);

      if (generatedSlipNumber !== "") {
        setValue("slip_no", String(generatedSlipNumber));
      }

      if (!projectId) {
        throw new Error(
          "The project was created, but the API did not return its ID. Check the project list before retrying.",
        );
      }

      projectSaved = true;

      for (const item of itemsToSave) {
        const quantity = Number(item.quantity);
        const rate = Number(item.rate);

        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error(`Invalid quantity for "${item.item_description}".`);
        }

        if (!Number.isFinite(rate) || rate < 0) {
          throw new Error(`Invalid rate for "${item.item_description}".`);
        }

        const itemPayload = {
          order: projectId,
          item_description: String(item.item_description).trim(),
          quantity,
          rate,
          size: item.size || "",
          maso: item.maso || "",
          paper_type: item.paper_type || "",
          band_type: item.band_type || "",
          Designing_person: item.Designing_person || null,
          printing_person: item.printing_person || null,
          binding_person: item.binding_person || null,
          work_type: item.work_type || "",
        };

        await addItems(itemPayload);
      }

      if (paymentAdvance > 0) {
        const amountPayload = {
          order: projectId,
          amount: paymentAdvance,
          status:
            data.paymentStatus === "Paid"
              ? "paid"
              : data.paymentStatus === "Partial"
                ? "partial"
                : "pending",
          payment_method:
            data.paymentMethod === "Cash"
              ? "cash"
              : data.paymentMethod === "Bank Transfer"
                ? "bank"
                : data.paymentMethod === "Card"
                  ? "card"
                  : data.paymentMethod === "eSewa"
                    ? "esewa"
                    : "khalti",
        };

        await createAmount(amountPayload);
      }

      toast.success("Project created successfully. Printing estimate...");
      setSavedProjectId(projectId);
      setJustCreated(true);
    } catch (error) {
      console.error("========== PROJECT SAVE FAILED ==========");
      console.error("STATUS:", error?.response?.status);
      console.error("BACKEND ERRORS:", error?.response?.data);
      console.error("ERROR:", error);

      const message = getErrorMessage(error);

      toast.error(
        projectSaved ? `The project may already be saved. ${message}` : message,
        { duration: 6000 },
      );
    }
  };

  useEffect(() => {
    if (!justCreated) return;

    const timer = setTimeout(() => {
      window.print();
      setJustCreated(false);
      navigate("/projects");
    }, 300);

    return () => clearTimeout(timer);
  }, [justCreated, navigate]);

  // --------------------------------------------------
  // LOADING STATE FOR EDIT MODE
  // --------------------------------------------------

  if (isEditMode && loadingExistingProject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-700">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-slate-500 dark:text-slate-300">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  const dueDateDisplay = formatDueDateForDisplay(formData.delivery_date);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <>
      <div className="no-print min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-700 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
                {isEditMode ? "Edit Project" : "Create Project"}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isEditMode
                  ? "Update customer order, printing items and project details."
                  : "Create customer order, estimate and payment details."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-7xl">
          {/* 01. CUSTOMER INFORMATION */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
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

          {/* 02. PROJECT / ORDER INFORMATION */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
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
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="Example: Wedding Cards"
                  {...register("project_name", {
                    required: "Project name is required.",
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                {errors.project_name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.project_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <FiCalendar size={15} />
                  Due Date
                </label>

                <div className="due-date-picker relative w-full min-w-0">
                  <Controller
                    name="delivery_date"
                    control={control}
                    rules={{ required: "Due date is required." }}
                    render={({ field }) => (
                      <NepaliDatePicker
                        calendarSystem="BS"
                        language="ne"
                        format="YYYY-MM-DD"
                        value={field.value || null}
                        onChange={(selectedDate) => {
                          field.onChange(selectedDate);
                        }}
                        placeholder="मिति छान्नुहोस्"
                      />
                    )}
                  />
                </div>

                {errors.delivery_date && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.delivery_date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Work Stage
                </label>
                <select
                  {...register("work_status", { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="printed">Printed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* 03. PRINTING ITEMS */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-slate-200">
                03. Printing Items
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Add products and printing details for this order.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <EstimateItems control={control} register={register} />
            </div>
          </div>

          {/* 04. ESTIMATE SUMMARY */}
          <div className="mb-6">
            <EstimateSummary control={control} register={register} />
          </div>

          {/* 05. PAYMENT INFORMATION */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
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
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Total Amount
                </p>
                <p className="mt-2 text-xl font-bold text-slate-800 dark:text-white">
                  Rs. {formatMoney(totalAmount)}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Advance Payment
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalAmount}
                  step="0.01"
                  {...register("advance", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Advance cannot be negative.",
                    },
                    max: {
                      value: totalAmount,
                      message: "Advance cannot exceed total amount.",
                    },
                  })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                {errors.advance && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.advance.message}
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-orange-50 p-4 dark:bg-orange-900/20">
                <p className="text-xs font-medium uppercase tracking-wide text-orange-500">
                  Remaining
                </p>
                <p className="mt-2 text-xl font-bold text-orange-600">
                  Rs. {formatMoney(remainingAmount)}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Payment Method
                </label>
                <select
                  {...register("paymentMethod")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Payment Status
                </label>
                <select
                  {...register("paymentStatus")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <FiCalendar size={15} />
                  Payment Date
                </label>
                <input
                  type="date"
                  {...register("paymentDate")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 06. NOTES */}
          <div className="mb-6">
            <EstimateFooter register={register} />
          </div>

          {/* 07. FINAL TOTAL */}
          <div className="mb-6 flex justify-end">
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800 sm:w-96">
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
                    Rs. {formatMoney(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Advance
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    Rs. {formatMoney(advance)}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Remaining
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      Rs. {formatMoney(remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mb-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || loadingExistingProject}
              className="rounded-xl bg-orange-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating..."
                : isEditMode
                  ? "Update Project"
                  : "Create & Print Estimate"}
            </button>
          </div>
        </form>
      </div>

      {/* PRINT VERSION */}
      <div className="print-estimate">
        <div className="print-header">
          <div className="print-title-section">
            <p>
              सीलीप नं: <strong>{formData.slip_no || "-"}</strong>
            </p>
            <p>
              मिति: <strong>{formData.slip_date || "-"}</strong>
            </p>
          </div>
        </div>

        <div className="print-section">
          <h2>CUSTOMER INFORMATION</h2>
          <div className="customer-grid">
            <div>
              <strong>Customer Name:</strong> {formData.customerName || "-"}
            </div>
            <div>
              <strong>Contact:</strong> {formData.contact_no || "-"}
            </div>

            <div>
              <strong>Project:</strong> {formData.project_name || "-"}
            </div>
            <div className="full-width">
              <strong>Address:</strong> {formData.address || "-"}
            </div>
          </div>
        </div>

        <div className="print-section">
          <h2>PROJECT INFORMATION</h2>
          <div className="customer-grid">
            <div>
              <strong>Project Name:</strong> {formData.project_name || "-"}
            </div>
            <div>
              <strong>Due Date:</strong> {dueDateDisplay}
            </div>
            <div>
              <strong>Customer:</strong> {formData.customerName || "-"}
            </div>
          </div>
        </div>

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

                if (!String(item.item_description || "").trim()) {
                  return null;
                }

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.item_description || "-"}</td>
                    <td>{item.size || "-"}</td>
                    <td>{quantity}</td>
                    <td>Rs. {formatMoney(rate)}</td>
                    <td>{item.maso || "-"}</td>
                    <td>{item.paper_type || "-"}</td>
                    <td>{item.band_type || "-"}</td>
                    <td>{item.work_type || "-"}</td>
                    <td>Rs. {formatMoney(amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="print-section">
          <h2>छपाइको पुर्ण बीवरण :</h2>
          <div className="printing-description">
            {formData.printingDetails || formData.description || "-"}
          </div>
        </div>

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
              <strong>Due Date:</strong> {dueDateDisplay}
            </div>
          </div>
        </div>

        <div className="print-summary-wrapper">
          <table className="print-summary">
            <tbody>
              <tr>
                <td>जम्मा रकम</td>
                <td>Rs. {formatMoney(totalAmount)}</td>
              </tr>
              <tr>
                <td>पेस्की</td>
                <td>Rs. {formatMoney(advance)}</td>
              </tr>
              <tr>
                <td>बाँकी</td>
                <td>Rs. {formatMoney(remainingAmount)}</td>
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
                <td>{dueDateDisplay}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="print-footer">
          <p>Thank you for your business.</p>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
