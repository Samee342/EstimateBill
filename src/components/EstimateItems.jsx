import { useState } from "react";
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
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-orange-900/30";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300";

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
        className={inputClass}
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

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <FaBoxOpen className="text-lg" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Estimate Items
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {fields.length} {fields.length === 1 ? "item" : "items"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Add products, specify printing requirements, and set pricing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 dark:border-orange-500/20 dark:bg-orange-500/10">
          <FaCalculator className="text-orange-600 dark:text-orange-400" />
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Items total
            </p>
            <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
              Rs. {formatMoney(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-5">
        {/* Item Entry Form */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/40">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                {editingIndex !== null ? "Edit Item" : "Add New Item"}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter the item and pricing details below.
              </p>
            </div>

            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetDraft}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-700 dark:hover:text-white"
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
              <div className="flex min-h-[42px] items-center rounded-lg border border-orange-100 bg-orange-50 px-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                  Rs.
                </span>
                <span className="ml-2 text-sm font-bold text-orange-700 dark:text-orange-300">
                  {formatMoney(draftAmount)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">Quantity × Rate</p>
            </div>
          </div>

          {/* Printing Details Toggle */}
          <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDetailsOpen((previous) => !previous)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <FaTools className="text-orange-500" />
                Printing Specifications & Work Assignment
                <span className="hidden text-xs font-normal text-slate-400 sm:inline">
                  (Optional)
                </span>
              </span>

              {detailsOpen ? (
                <FaChevronUp className="shrink-0 text-xs text-slate-400" />
              ) : (
                <FaChevronDown className="shrink-0 text-xs text-slate-400" />
              )}
            </button>

            {detailsOpen && (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Printing Specifications
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {renderDraftField("Size", "size", "e.g. A4, A3, 12 × 18")}

                    {renderDraftField(
                      "Ink / Maso",
                      "maso",
                      "e.g. 1 color, 4 color",
                    )}

                    {renderDraftField(
                      "Paper Type",
                      "paper_type",
                      "e.g. Art paper, offset",
                    )}

                    {renderDraftField(
                      "Band Type",
                      "band_type",
                      "Enter band type",
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Work Assignment
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {renderDraftField(
                      "Work Type",
                      "work_type",
                      "e.g. Offset, digital",
                    )}

                    {renderDraftField(
                      "Designer",
                      "Designing_person",
                      "Designer name",
                    )}

                    {renderDraftField(
                      "Printing Person",
                      "printing_person",
                      "Printer name",
                    )}

                    {renderDraftField(
                      "Binding Person",
                      "binding_person",
                      "Binding staff name",
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          {/* Add / Update Button */}
          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end dark:border-slate-700">
            {editingIndex !== null && (
              <button
                type="button"
                onClick={resetDraft}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]"
            >
              {editingIndex !== null ? <FaEdit /> : <FaPlus />}
              {editingIndex !== null ? "Update Item" : "Add Item"}
            </button>
          </div>
        </div>

        {/* Added Items: render nothing until an item exists */}
        {fields.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Added Items
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Review and edit items before saving your estimate.
                </p>
              </div>

              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {fields.length} total
              </span>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const item = items?.[index] || field;
                const itemAmount = calculateAmount(item);
                const isExpanded = Boolean(expandedItems[index]);

                return (
                  <div
                    key={field.id}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          {item.item_description?.trim() && (
                            <p className="break-words text-sm font-semibold text-slate-800 dark:text-white">
                              {item.item_description.trim()}
                            </p>
                          )}

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              Qty:{" "}
                              <strong className="font-semibold text-slate-700 dark:text-slate-300">
                                {item.quantity ?? 0}
                              </strong>
                            </span>

                            <span>
                              Rate:{" "}
                              <strong className="font-semibold text-slate-700 dark:text-slate-300">
                                Rs. {formatMoney(item.rate)}
                              </strong>
                            </span>

                            {item.size && <span>Size: {item.size}</span>}
                            {item.paper_type && <span>{item.paper_type}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 dark:border-slate-700">
                        <div className="sm:text-right">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                            Amount
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-white">
                            Rs. {formatMoney(itemAmount)}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleItemDetails(index)}
                            title={isExpanded ? "Hide details" : "View details"}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
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
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-orange-600 transition hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10"
                          >
                            <FaEdit />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            title="Remove item"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 dark:border-slate-700 dark:bg-slate-800/40">
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

                          {renderRegisteredField(
                            index,
                            "paper_type",
                            "Paper Type",
                            "Enter paper type",
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

                          {renderRegisteredField(
                            index,
                            "Designing_person",
                            "Designer",
                            "Enter designer",
                          )}

                          {renderRegisteredField(
                            index,
                            "printing_person",
                            "Printing Person",
                            "Enter printing person",
                          )}

                          {renderRegisteredField(
                            index,
                            "binding_person",
                            "Binding Person",
                            "Enter binding person",
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

        {/* Total Footer */}
        <div className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-orange-500/20 dark:bg-orange-500/5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 dark:bg-slate-800 dark:text-orange-400">
              <FaCalculator />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                Estimate items total
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Calculated automatically from quantity × rate for each item.
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Amount
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-orange-700 dark:text-orange-400">
              Rs. {formatMoney(totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EstimateItems;
