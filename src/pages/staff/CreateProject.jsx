import React, { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiUser,
  FiPrinter,
  FiCheckCircle,
} from "react-icons/fi";

/* =========================================================
   STAFF DATA
   Later this will come from API / Redux
========================================================= */

const staffMembers = [
  {
    id: 2,
    name: "PrintTech Staff",
    role: "Printing",
  },
  {
    id: 3,
    name: "Rahul",
    role: "Design",
  },
  {
    id: 4,
    name: "Amit",
    role: "Pre-Press",
  },
  {
    id: 5,
    name: "Suresh",
    role: "Finishing",
  },
];

/* =========================================================
   CREATE PROJECT
========================================================= */

const CreateProject = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slipNumber: "",
      date: "",
      customerName: "",
      panNumber: "",
      address: "",
      contactNumber: "",

      projectName: "",
      description: "",
      dueDate: "",
      priority: "Normal",

      items: [
        {
          description: "",
          quantity: 1,
          rate: 0,
          size: "",
          ink: "",
          paperType: "",
          bindingType: "",

          /* Production Assignment */

          designDatePerson: "",
          printingDatePerson: "",
          bindingDatePerson: "",

          workType: "Offset Printing",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  /* =========================================================
     TOTAL AMOUNT
  ========================================================= */

  const totalAmount = useMemo(() => {
    return watchedItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;

      return total + quantity * rate;
    }, 0);
  }, [watchedItems]);

  /* =========================================================
     CREATE PRODUCTION TASKS
  ========================================================= */

  const createProductionTasks = (items, projectId, projectName, customer) => {
    const tasks = [];

    items.forEach((item, index) => {
      const itemNumber = index + 1;

      /* ---------------------------------------------
         DESIGN TASK
      --------------------------------------------- */

      if (item.designDatePerson) {
        const designStaff = staffMembers.find(
          (staff) => staff.id === Number(item.designDatePerson)
        );

        tasks.push({
          id: `TASK-${projectId}-D-${itemNumber}`,

          projectId,
          projectName,
          customer,

          itemNumber,

          workType: "Design",

          productionType: item.workType,

          assignedTo: designStaff?.id || null,
          assignedToName: designStaff?.name || "",

          status: "Pending",
          progress: 0,

          quantity: Number(item.quantity) || 0,

          startDate: "",
          dueDate: "",

          notes: "",
        });
      }

      /* ---------------------------------------------
         PRINTING TASK
      --------------------------------------------- */

      if (item.printingDatePerson) {
        const printingStaff = staffMembers.find(
          (staff) => staff.id === Number(item.printingDatePerson)
        );

        tasks.push({
          id: `TASK-${projectId}-P-${itemNumber}`,

          projectId,
          projectName,
          customer,

          itemNumber,

          workType: "Printing",

          productionType: item.workType,

          assignedTo: printingStaff?.id || null,
          assignedToName: printingStaff?.name || "",

          status: "Pending",
          progress: 0,

          quantity: Number(item.quantity) || 0,

          startDate: "",
          dueDate: "",

          notes: "",
        });
      }

      /* ---------------------------------------------
         BINDING TASK
      --------------------------------------------- */

      if (item.bindingDatePerson) {
        const bindingStaff = staffMembers.find(
          (staff) => staff.id === Number(item.bindingDatePerson)
        );

        tasks.push({
          id: `TASK-${projectId}-B-${itemNumber}`,

          projectId,
          projectName,
          customer,

          itemNumber,

          workType: "Binding",

          productionType: item.workType,

          assignedTo: bindingStaff?.id || null,
          assignedToName: bindingStaff?.name || "",

          status: "Pending",
          progress: 0,

          quantity: Number(item.quantity) || 0,

          startDate: "",
          dueDate: "",

          notes: "",
        });
      }
    });

    return tasks;
  };

  /* =========================================================
     SUBMIT PROJECT
  ========================================================= */

  const onSubmit = (data) => {
    const projectId = `PRJ-${Date.now()}`;

    /* ---------------------------------------------
       CREATE PRODUCTION TASKS
    --------------------------------------------- */

    const productionTasks = createProductionTasks(
      data.items,
      projectId,
      data.projectName,
      data.customerName
    );

    /* ---------------------------------------------
       FINAL PROJECT OBJECT
    --------------------------------------------- */

    const projectData = {
      id: projectId,

      slipNumber: data.slipNumber,

      date: data.date,

      customerName: data.customerName,
      panNumber: data.panNumber,
      address: data.address,
      contactNumber: data.contactNumber,

      projectName: data.projectName,
      description: data.description,

      dueDate: data.dueDate,

      priority: data.priority,

      items: data.items,

      totalAmount,

      status: "Pending",

      productionTasks,
    };

    console.log("================================");
    console.log("PROJECT CREATED");
    console.log("================================");

    console.log(projectData);

    console.log("================================");
    console.log("PRODUCTION TASKS");
    console.log("================================");

    console.table(productionTasks);

    alert("Project and production tasks created successfully!");

    reset();

    navigate("/projects");
  };

  /* =========================================================
     ADD ITEM
  ========================================================= */

  const handleAddItem = () => {
    append({
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

      workType: "Offset Printing",
    });
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900"
          >
            <FiArrowLeft size={18} />
          </button>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Project Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              Create Project
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create project and assign production work to staff.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FORM
      ===================================================== */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ===================================================
            CUSTOMER INFORMATION
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Customer Information
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Enter customer and project basic information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            {/* Slip Number */}

            <FormInput
              label="Slip Number"
              placeholder="SLIP-1001"
              {...register("slipNumber")}
            />

            {/* Date */}

            <FormInput
              label="Date"
              type="date"
              {...register("date", {
                required: "Date is required",
              })}
              error={errors.date?.message}
            />

            {/* Customer */}

            <FormInput
              label="Customer Name"
              placeholder="Ram Sharma"
              {...register("customerName", {
                required: "Customer name is required",
              })}
              error={errors.customerName?.message}
            />

            {/* PAN */}

            <FormInput
              label="PAN Number"
              placeholder="601234567"
              {...register("panNumber")}
            />

            {/* Contact */}

            <FormInput
              label="Contact Number"
              placeholder="9841234567"
              {...register("contactNumber")}
            />

            {/* Address */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Address
              </label>

              <textarea
                rows="3"
                placeholder="Customer address"
                {...register("address")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/10"
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            PROJECT INFORMATION
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">
              Project Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            {/* Project Name */}

            <FormInput
              label="Project Name"
              placeholder="Restaurant Menu"
              {...register("projectName", {
                required: "Project name is required",
              })}
              error={errors.projectName?.message}
            />

            {/* Due Date */}

            <FormInput
              label="Due Date"
              type="date"
              {...register("dueDate", {
                required: "Due date is required",
              })}
              error={errors.dueDate?.message}
            />

            {/* Priority */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </label>

              <select
                {...register("priority")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Description */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>

              <textarea
                rows="3"
                placeholder="Project description..."
                {...register("description")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            PRINTING ITEMS
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}

          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Printing Items
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Add items and define their production workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <FiPlus size={16} />
              Add Item
            </button>
          </div>

          {/* Items */}

          <div className="space-y-5 p-5">
            {fields.map((field, index) => {
              const item = watchedItems[index] || {};

              return (
                <div
                  key={field.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-700 dark:bg-slate-800/40"
                >
                  {/* Item Header */}

                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Printing Item {index + 1}
                        </h3>

                        <p className="text-xs text-slate-400">
                          Define item and production workflow
                        </p>
                      </div>
                    </div>

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Remove item"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    )}
                  </div>

                  {/* -------------------------------------------
                      ITEM BASIC INFORMATION
                  ------------------------------------------- */}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    {/* Description */}

                    <FormInput
                      label="Item Description"
                      placeholder="Menu Card"
                      {...register(
                        `items.${index}.description`,
                        {
                          required: "Description is required",
                        }
                      )}
                      error={
                        errors.items?.[index]?.description?.message
                      }
                    />

                    {/* Quantity */}

                    <FormInput
                      label="Quantity"
                      type="number"
                      min="1"
                      placeholder="1000"
                      {...register(
                        `items.${index}.quantity`,
                        {
                          required: true,
                          min: 1,
                        }
                      )}
                    />

                    {/* Rate */}

                    <FormInput
                      label="Rate"
                      type="number"
                      min="0"
                      placeholder="12.50"
                      {...register(
                        `items.${index}.rate`
                      )}
                    />

                    {/* Size */}

                    <FormInput
                      label="Size"
                      placeholder="A4"
                      {...register(
                        `items.${index}.size`
                      )}
                    />

                    {/* Ink */}

                    <FormInput
                      label="Ink"
                      placeholder="4 Color"
                      {...register(
                        `items.${index}.ink`
                      )}
                    />

                    {/* Paper */}

                    <FormInput
                      label="Paper Type"
                      placeholder="Art Paper"
                      {...register(
                        `items.${index}.paperType`
                      )}
                    />

                    {/* Binding */}

                    <FormInput
                      label="Binding Type"
                      placeholder="Perfect Binding"
                      {...register(
                        `items.${index}.bindingType`
                      )}
                    />

                    {/* Work Type */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Work Type
                      </label>

                      <select
                        {...register(
                          `items.${index}.workType`
                        )}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="Offset Printing">
                          Offset Printing
                        </option>

                        <option value="Digital Printing">
                          Digital Printing
                        </option>

                        <option value="Flex Printing">
                          Flex Printing
                        </option>

                        <option value="Screen Printing">
                          Screen Printing
                        </option>

                        <option value="Large Format">
                          Large Format
                        </option>

                        <option value="Sticker Printing">
                          Sticker Printing
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* -------------------------------------------
                      PRODUCTION ASSIGNMENT
                  ------------------------------------------- */}

                  <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 dark:border-orange-500/10 dark:bg-orange-500/5">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <FiPrinter size={16} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300">
                          Production Assignment
                        </h3>

                        <p className="text-xs text-orange-600/70 dark:text-orange-300/60">
                          Assign staff for each production stage.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {/* DESIGN STAFF */}

                      <StaffSelect
                        label="Design Staff"
                        icon={FiUser}
                        valueName={`items.${index}.designDatePerson`}
                        register={register}
                      />

                      {/* PRINTING STAFF */}

                      <StaffSelect
                        label="Printing Staff"
                        icon={FiPrinter}
                        valueName={`items.${index}.printingDatePerson`}
                        register={register}
                      />

                      {/* BINDING STAFF */}

                      <StaffSelect
                        label="Binding Staff"
                        icon={FiUser}
                        valueName={`items.${index}.bindingDatePerson`}
                        register={register}
                      />
                    </div>
                  </div>

                  {/* -------------------------------------------
                      TASK PREVIEW
                  ------------------------------------------- */}

                  <div className="mt-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Production Task Preview
                    </p>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <TaskPreview
                        title="Design"
                        staffId={item.designDatePerson}
                      />

                      <TaskPreview
                        title="Printing"
                        staffId={item.printingDatePerson}
                      />

                      <TaskPreview
                        title="Binding"
                        staffId={item.bindingDatePerson}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            SUMMARY
        =================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Project Total
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  Rs. {totalAmount.toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Based on quantity × rate
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                <FiCheckCircle size={18} />

                <span className="text-sm font-semibold">
                  Production workflow ready
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            ACTIONS
        =================================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            <FiCheckCircle size={17} />
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

/* =========================================================
   FORM INPUT
========================================================= */

const FormInput = React.forwardRef(
  (
    {
      label,
      error,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>

        <input
          ref={ref}
          type={type}
          {...props}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-orange-400 focus:ring-orange-100 dark:border-slate-700 dark:focus:ring-orange-500/10"
          }`}
        />

        {error && (
          <p className="mt-1 text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

/* =========================================================
   STAFF SELECT
========================================================= */

const StaffSelect = ({
  label,
  icon: Icon,
  valueName,
  register,
}) => {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-bold text-orange-800 dark:text-orange-300">
        <Icon size={14} />
        {label}
      </label>

      <select
        {...register(valueName)}
        className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-orange-500/10"
      >
        <option value="">Not Assigned</option>

        {staffMembers.map((staff) => (
          <option key={staff.id} value={staff.id}>
            {staff.name} — {staff.role}
          </option>
        ))}
      </select>
    </div>
  );
};

/* =========================================================
   TASK PREVIEW
========================================================= */

const TaskPreview = ({ title, staffId }) => {
  const staff = staffMembers.find(
    (item) => String(item.id) === String(staffId)
  );

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <FiUser size={14} />
        </div>

        <div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {title}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {staff ? staff.name : "Not Assigned"}
          </p>
        </div>
      </div>

      {staff ? (
        <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
          Assigned
        </span>
      ) : (
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-400 dark:bg-slate-800">
          Pending
        </span>
      )}
    </div>
  );
};

export default CreateProject;