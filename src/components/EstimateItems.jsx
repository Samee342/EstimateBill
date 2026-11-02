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
  "w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-orange-900/30";

const labelClass =
  "mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-300";

const paperOptions = [
  { value: "art", label: "Art Paper" },
  { value: "card", label: "Card Paper" },
  { value: "newsprint", label: "Newsprint Paper" },
  { value: "coated", label: "Coated Paper" },
];

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
    <div className="min-w-0">
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
              : "Select staff"}
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

        if (oldIndex < index) next[oldIndex] = previous[key];
        if (oldIndex > index) next[oldIndex - 1] = previous[key];
      });

      return next;
    });

    if (editingIndex === index) {
      resetDraft();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const renderDraftField = (
    label,
    field,
    placeholder = "",
    type = "text",
    extraProps = {},
  ) => (
    <div className="min-w-0">
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
        {...extraProps}
      />
    </div>
  );

  const renderRegisteredField = (index, field, label, placeholder = "") => (
    <div className="min-w-0">
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

  const renderPaperSelect = (value, onChange) => (
    <div className="min-w-0">
      <label className={labelClass}>Paper Type</label>
      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        <option value="">Select paper</option>
        {paperOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <section className="mt-4 overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Compact Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
            <FaBoxOpen className="text-sm" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Estimate Items
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {fields.length} {fields.length === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Add items, printing details and pricing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1.5 sm:self-auto dark:border-orange-500/20 dark:bg-orange-500/10">
          <FaCalculator className="text-xs text-orange-700 dark:text-orange-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total:
          </span>
          <span className="text-sm font-bold text-orange-800 dark:text-orange-400">
            Rs. {formatMoney(totalAmount)}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-3">
        {/* Compact Item Form */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {editingIndex !== null ? "Edit Item" : "Add New Item"}
              </h3>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">
                Enter item and pricing details.
              </p>
            </div>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetDraft}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <FaTimes /> Cancel
              </button>
            )}
          </div>

          {/* Main fields */}
          <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-12">
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
              <div className="flex min-h-[37px] items-center rounded-md border border-orange-200 bg-orange-50 px-2.5 dark:border-orange-500/20 dark:bg-orange-500/10">
                <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-400">
                  Rs.
                </span>
                <span className="ml-1.5 text-sm font-bold text-orange-900 dark:text-orange-300">
                  {formatMoney(draftAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-3 border-t border-slate-200 pt-2.5 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDetailsOpen((previous) => !previous)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <FaTools className="text-orange-600" />
                Printing Specifications & Work Assignment
              </span>

              {detailsOpen ? (
                <FaChevronUp className="shrink-0 text-[10px] text-slate-500" />
              ) : (
                <FaChevronDown className="shrink-0 text-[10px] text-slate-500" />
              )}
            </button>

            {detailsOpen && (
              <div className="mt-3 space-y-3">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Printing Specifications
                  </p>

                  <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {renderDraftField("Size", "size", "e.g. A4, A3")}
                    {renderDraftField(
                      "Ink / Maso",
                      "maso",
                      "e.g. 1 color, 4 color",
                      "text",
                      {
                        pattern: ".*",
                      },
                    )}
                    {renderPaperSelect(draft.paper_type, (value) =>
                      handleDraftChange("paper_type", value),
                    )}
                    {renderDraftField(
                      "Band Type",
                      "band_type",
                      "Enter bind type",
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Work Assignment
                  </p>

                  <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-[11px] font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Form actions */}
          <div className="mt-3 flex flex-col-reverse gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:justify-end dark:border-slate-700">
            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetDraft}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center justify-center gap-1.5 rounded-md bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 active:scale-[0.98]"
            >
              {editingIndex !== null ? <FaEdit /> : <FaPlus />}
              {editingIndex !== null ? "Update Item" : "Add Item"}
            </button>
          </div>

          {/* Added Items */}
          {fields.length > 0 && (
            <div className="mt-3 border-t border-dashed border-slate-300 pt-3 dark:border-slate-600">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Added Items
                </h3>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {fields.length} total
                </span>
              </div>

              <div className="space-y-1.5">
                {fields.map((field, index) => {
                  const item = items?.[index] || field;
                  const itemAmount = calculateAmount(item);
                  const isExpanded = Boolean(expandedItems[index]);

                  return (
                    <div
                      key={field.id}
                      className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    >
                      {/* Compact item row */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-2.5 py-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-100 text-[10px] font-bold text-orange-800 dark:bg-orange-500/20 dark:text-orange-300">
                          {index + 1}
                        </span>

                        <div className="min-w-[120px] flex-1">
                          <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                            {item.item_description?.trim() || "Untitled item"}
                          </p>
                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                            Qty: {item.quantity ?? 0} × Rs.{" "}
                            {formatMoney(item.rate)}
                            {item.size ? ` · ${item.size}` : ""}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[9px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                            Amount
                          </p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Rs. {formatMoney(itemAmount)}
                          </p>
                        </div>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => toggleItemDetails(index)}
                            title={isExpanded ? "Hide details" : "View details"}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {isExpanded ? (
                              <FaChevronUp className="text-[10px]" />
                            ) : (
                              <FaChevronDown className="text-[10px]" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditItem(index)}
                            title="Edit item"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                          >
                            <FaEdit className="text-xs" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            title="Remove item"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <FaTrash className="text-[10px]" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded item details */}
                      {isExpanded && (
                        <div className="border-t border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                          <div className="grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
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
                            {renderPaperSelect(item.paper_type, (value) =>
                              update(index, { ...item, paper_type: value }),
                            )}
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

        {/* Compact Total */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="flex items-center gap-2">
            <FaCalculator className="text-sm text-orange-700 dark:text-orange-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Estimate Items Total
            </span>
          </div>

          <p className="text-base font-bold text-orange-800 dark:text-orange-400">
            Rs. {formatMoney(totalAmount)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EstimateItems;
