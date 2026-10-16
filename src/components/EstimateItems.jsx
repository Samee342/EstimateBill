import { useEffect, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import {
  FaPlus,
  FaTrash,
  FaBoxOpen,
  FaCalculator,
  FaChevronDown,
  FaChevronUp,
  FaTools,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import { getTeam } from "../api/team";

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

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-orange-900/30";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-800 dark:text-slate-200";

const EstimateItems = ({ control, register }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  const [draft, setDraft] = useState({ ...emptyItem });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [error, setError] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setStaffLoading(true);

        const response = await getTeam();

        const staff = Array.isArray(response)
          ? response
          : Array.isArray(response?.staff_members)
            ? response.staff_members
            : Array.isArray(response?.results)
              ? response.results
              : Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response?.data?.staff_members)
                  ? response.data.staff_members
                  : [];

        setStaffList(staff.filter((member) => member.id != null));
      } catch (error) {
        console.error("Failed to get staff:", error);
        setStaffList([]);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const calculateAmount = (item) => {
    const quantity = Number(item?.quantity) || 0;
    const rate = Number(item?.rate) || 0;
    return quantity * rate;
  };

  const totalAmount =
    items?.reduce((total, item) => total + calculateAmount(item), 0) || 0;

  const draftAmount = calculateAmount(draft);

  const handleDraftChange = (field, value) => {
    setDraft((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) setError("");
  };

  const renderStaffSelect = (label, value, onChange) => (
    <div>
      <label className={labelClass}>{label}</label>

      <select
        value={value == null ? "" : String(value)}
        onChange={(event) => {
          const selectedValue = event.target.value;
          onChange(selectedValue === "" ? "" : Number(selectedValue));
        }}
        className={inputClass}
        disabled={staffLoading}
      >
        <option value="">
          {staffLoading
            ? "Loading staff..."
            : staffList.length === 0
              ? "No staff available"
              : "Select staff member"}
        </option>

        {staffList.map((member) => (
          <option key={member.id} value={member.id}>
            {member.username ||
              member.name ||
              member.full_name ||
              `Staff #${member.id}`}
          </option>
        ))}
      </select>
    </div>
  );

  const resetDraft = () => {
    setDraft({ ...emptyItem });
    setEditingIndex(null);
    setDetailsOpen(false);
    setError("");
  };

  const handleAddItem = () => {
    if (!draft.item_description.trim()) {
      setError("Please enter an item description.");
      return;
    }

    if (
      draft.quantity === "" ||
      !Number.isFinite(Number(draft.quantity)) ||
      Number(draft.quantity) <= 0
    ) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (
      draft.rate === "" ||
      !Number.isFinite(Number(draft.rate)) ||
      Number(draft.rate) < 0
    ) {
      setError("Please enter a valid rate.");
      return;
    }

    const newItem = {
      ...draft,
      item_description: draft.item_description.trim(),
      quantity: Number(draft.quantity),
      rate: Number(draft.rate),
      Designing_person: draft.Designing_person
        ? Number(draft.Designing_person)
        : null,
      printing_person: draft.printing_person
        ? Number(draft.printing_person)
        : null,
      binding_person: draft.binding_person
        ? Number(draft.binding_person)
        : null,
    };

    if (editingIndex !== null) {
      update(editingIndex, newItem);
    } else {
      append(newItem);
    }

    resetDraft();
  };

  const handleEditItem = (index) => {
    const item = items?.[index];

    if (!item) return;

    setDraft({
      ...emptyItem,
      ...item,
      Designing_person: item.Designing_person ?? "",
      printing_person: item.printing_person ?? "",
      binding_person: item.binding_person ?? "",
    });

    setEditingIndex(index);
    setDetailsOpen(true);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const toggleItemDetails = (index) => {
    setExpandedItems((previous) => ({
      ...previous,
      [index]: !previous[index],
    }));
  };

  const handleRemoveItem = (index) => {
    remove(index);

    setExpandedItems((previous) => {
      const next = {};

      Object.keys(previous).forEach((key) => {
        const oldIndex = Number(key);

        if (oldIndex < index) {
          next[oldIndex] = previous[key];
        } else if (oldIndex > index) {
          next[oldIndex - 1] = previous[key];
        }
      });

      return next;
    });

    if (editingIndex === index) {
      resetDraft();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const renderDraftField = (label, field, placeholder = "", type = "text") => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={draft[field] ?? ""}
        placeholder={placeholder}
        min={type === "number" ? (field === "quantity" ? "1" : "0") : undefined}
        step={field === "quantity" ? "1" : "any"}
        onChange={(event) => handleDraftChange(field, event.target.value)}
        className={`${inputClass} ${
          type === "number"
            ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            : ""
        }`}
      />
    </div>
  );

  const renderRegisteredField = (index, field, label, placeholder = "") => (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        {...register(`items.${index}.${field}`)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );

  const handleAssignedStaffChange = (index, field, value) => {
    const currentItem = items?.[index] || fields[index];

    if (!currentItem) return;

    update(index, {
      ...currentItem,
      [field]: value === "" ? null : Number(value),
    });
  };

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
            <FaBoxOpen className="text-lg" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Estimate Items
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                {fields.length} {fields.length === 1 ? "item" : "items"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              Add products, specify printing requirements, and set pricing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 dark:border-orange-500/20 dark:bg-orange-500/10">
          <FaCalculator className="text-orange-700 dark:text-orange-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Items total
            </p>
            <p className="text-sm font-bold text-orange-800 dark:text-orange-400">
              Rs. {formatMoney(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {/* Item Entry Form */}
        <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/40">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingIndex !== null ? "Edit Item" : "Add New Item"}
              </h3>
              <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                Enter the item and pricing details below.
              </p>
            </div>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetDraft}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <FaTimes />
                Cancel
              </button>
            )}
          </div>

          {/* Main Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-5">
              {renderDraftField(
                "Item Description *",
                "item_description",
                "e.g. Visiting cards, brochures, banners",
              )}
            </div>

            <div className="lg:col-span-2">
              {renderDraftField("Quantity *", "quantity", "1", "number")}
            </div>

            <div className="lg:col-span-2">
              {renderDraftField("Rate (Rs.) *", "rate", "0.00", "number")}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelClass}>Amount</label>
              <div className="flex min-h-[42px] items-center rounded-lg border border-orange-200 bg-orange-50 px-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                <span className="text-xs font-semibold text-orange-800 dark:text-orange-400">
                  Rs.
                </span>
                <span className="ml-2 text-sm font-bold text-orange-900 dark:text-orange-300">
                  {formatMoney(draftAmount)}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                Quantity × Rate
              </p>
            </div>
          </div>

          {/* Printing Details Toggle */}
          <div className="mt-5 border-t border-slate-300 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDetailsOpen((previous) => !previous)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <FaTools className="text-orange-600" />
                Printing Specifications & Work Assignment
                <span className="hidden text-xs font-medium text-slate-600 sm:inline dark:text-slate-400">
                  (Optional)
                </span>
              </span>

              {detailsOpen ? (
                <FaChevronUp className="shrink-0 text-xs text-slate-600 dark:text-slate-400" />
              ) : (
                <FaChevronDown className="shrink-0 text-xs text-slate-600 dark:text-slate-400" />
              )}
            </button>

            {detailsOpen && (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Printing Specifications
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {renderDraftField("Size", "size", "e.g. A4, A3, 12 × 18")}
                    {renderDraftField(
                      "Ink / Masi",
                      "maso",
                      "e.g. 1 color, 4 color",
                      {
                        validate: (value) => {
                          // If the field is empty, let 'required' handle it instead
                          if (!value) return true;

                          // Check if the input is ONLY numbers (e.g., "1234")
                          const isOnlyNumbers = /^\d+$/.test(value.trim());

                          return (
                            !isOnlyNumbers || "Only text values are allowed"
                          );
                        },
                      },
                    )}

                    <div>
                      <label className={labelClass}>Paper Type</label>

                      <select
                        value={draft.paper_type || ""}
                        onChange={(e) =>
                          handleDraftChange("paper_type", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="">Select Paper Type</option>
                        <option value="art">Art Paper</option>
                        <option value="card">Card Paper</option>
                        <option value="newsprint">Newsprint Paper</option>
                        <option value="coated">Coated Paper</option>
                      </select>
                    </div>

                    {renderDraftField(
                      "Bind Type",
                      "band_type",
                      "Enter bind type",
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-300 pt-4 dark:border-slate-700">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Work Assignment
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {renderDraftField(
                      "Work Type",
                      "work_type",
                      "e.g. Offset, digital",
                    )}

                    {renderStaffSelect(
                      "Designer",
                      draft.Designing_person,
                      (value) => handleDraftChange("Designing_person", value),
                    )}

                    {renderStaffSelect(
                      "Printing Person",
                      draft.printing_person,
                      (value) => handleDraftChange("printing_person", value),
                    )}

                    {renderStaffSelect(
                      "Binding Person",
                      draft.binding_person,
                      (value) => handleDraftChange("binding_person", value),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Add / Update Button */}
          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-300 pt-4 sm:flex-row sm:justify-end dark:border-slate-700">
            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetDraft}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-[0.98]"
            >
              {editingIndex !== null ? <FaEdit /> : <FaPlus />}
              {editingIndex !== null ? "Update Item" : "Add Item"}
            </button>
          </div>

          {/* Added Items: directly below the form fields in the same container */}
          {fields.length > 0 && (
            <div className="mt-4 border-t border-dashed border-slate-300 pt-4 dark:border-slate-600">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Added Items
                </h3>

                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {fields.length} total
                </span>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => {
                  const item = items?.[index] || field;
                  const itemAmount = calculateAmount(item);
                  const isExpanded = Boolean(expandedItems[index]);

                  return (
                    <div
                      key={field.id}
                      className="overflow-hidden rounded-lg border border-slate-300 bg-white transition hover:border-orange-300 dark:border-slate-600 dark:bg-slate-900"
                    >
                      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-900 dark:bg-orange-500/20 dark:text-orange-300">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 flex-1">
                            {item.item_description?.trim() && (
                              <p className="break-words text-sm font-bold text-slate-900 dark:text-white">
                                {item.item_description.trim()}
                              </p>
                            )}

                            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                              <span>
                                Qty:{" "}
                                <strong className="font-bold text-slate-900 dark:text-white">
                                  {item.quantity ?? 0}
                                </strong>
                              </span>

                              <span>
                                Rate:{" "}
                                <strong className="font-bold text-slate-900 dark:text-white">
                                  Rs. {formatMoney(item.rate)}
                                </strong>
                              </span>

                              {item.size && <span>Size: {item.size}</span>}
                              {item.paper_type && (
                                <span>Paper: {item.paper_type}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-2 sm:border-0 sm:pt-0 dark:border-slate-700">
                          <div className="sm:text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                              Amount
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                              Rs. {formatMoney(itemAmount)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleItemDetails(index)}
                              title={
                                isExpanded ? "Hide details" : "View details"
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                              {isExpanded ? (
                                <FaChevronUp className="text-xs" />
                              ) : (
                                <FaChevronDown className="text-xs" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditItem(index)}
                              title="Edit item"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-orange-700 transition hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              title="Remove item"
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-red-700 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-slate-300 bg-slate-100/70 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/60">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {renderRegisteredField(
                              index,
                              "size",
                              "Size",
                              "Enter size",
                            )}

                            {renderRegisteredField(
                              index,
                              "maso",
                              "Ink / Maso",
                              "Enter ink details",
                            )}

                            <div>
                              <label className={labelClass}>Paper Type</label>

                              <select
                                value={item.paper_type || ""}
                                onChange={(e) =>
                                  update(index, {
                                    ...item,
                                    paper_type: e.target.value,
                                  })
                                }
                                className={inputClass}
                              >
                                <option value="">Select Paper Type</option>
                                <option value="art">Art Paper</option>
                                <option value="card">Card Paper</option>
                                <option value="newsprint">
                                  Newsprint Paper
                                </option>
                                <option value="coated">Coated Paper</option>
                              </select>
                            </div>

                            {renderRegisteredField(
                              index,
                              "band_type",
                              "Band Type",
                              "Enter band type",
                            )}

                            {renderRegisteredField(
                              index,
                              "work_type",
                              "Work Type",
                              "Enter work type",
                            )}

                            {renderStaffSelect(
                              "Designer",
                              item.Designing_person,
                              (value) =>
                                handleAssignedStaffChange(
                                  index,
                                  "Designing_person",
                                  value,
                                ),
                            )}

                            {renderStaffSelect(
                              "Printing Person",
                              item.printing_person,
                              (value) =>
                                handleAssignedStaffChange(
                                  index,
                                  "printing_person",
                                  value,
                                ),
                            )}

                            {renderStaffSelect(
                              "Binding Person",
                              item.binding_person,
                              (value) =>
                                handleAssignedStaffChange(
                                  index,
                                  "binding_person",
                                  value,
                                ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Total Footer */}
        <div className="flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-700 dark:bg-slate-800 dark:text-orange-400">
              <FaCalculator />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Estimate items total
              </p>
              <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                Calculated automatically from quantity × rate for each item.
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total Amount
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-orange-800 dark:text-orange-400">
              Rs. {formatMoney(totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstimateItems;
