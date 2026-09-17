import { useFieldArray, useWatch } from "react-hook-form";
import { FaPlus, FaTrash, FaBoxOpen, FaCalculator } from "react-icons/fa";

const emptyItem = {
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
};

const EstimateItems = ({ control, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  const addRow = () => {
    append({ ...emptyItem });
  };

  const calculateAmount = (index) => {
    const quantity = Number(items?.[index]?.quantity) || 0;
    const rate = Number(items?.[index]?.rate) || 0;

    return quantity * rate;
  };

  const totalAmount =
    items?.reduce((total, item) => {
      const quantity = Number(item?.quantity) || 0;
      const rate = Number(item?.rate) || 0;

      return total + quantity * rate;
    }, 0) || 0;

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 shadow-sm">
      {/* =========================================
          SECTION HEADER
      ========================================== */}

      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <FaBoxOpen className="text-sm" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-slate-800 dark:text-slate-300">
                Estimate Items
              </h2>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                {fields.length} {fields.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Add products, printing details and pricing information.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <button
          type="button"
          onClick={addRow}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 active:scale-[0.98]"
        >
          <FaPlus className="text-xs" />
          Add Item
        </button>
      </div>

      {/* =========================================
          TABLE
      ========================================== */}

      <div className="overflow-x-auto">
        <table className="min-w-[1900px] w-full border-collapse text-sm">
          {/* =====================================
              HEADER
          ====================================== */}

          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 dark:bg-slate-800 text-center text-[12px] font-semibold text-slate-600 dark:text-slate-400">
              <th className="w-14 border-b border-r border-slate-200 px-3 py-3">
                क्र.सं.
              </th>

              <th className="w-64 border-b border-r border-slate-200 px-3 py-3 text-left">
                सामानको विवरण
              </th>

              <th className="w-20 border-b border-r border-slate-200 px-3 py-3">
                संख्या
              </th>

              <th className="w-24 border-b border-r border-slate-200 px-3 py-3">
                दर
              </th>

              <th className="w-24 border-b border-r border-slate-200 px-3 py-3">
                आकार
              </th>

              <th className="w-24 border-b border-r border-slate-200 px-3 py-3">
                मसी
              </th>

              <th className="w-36 border-b border-r border-slate-200 px-3 py-3">
                कागजको प्रकार
              </th>

              <th className="w-36 border-b border-r border-slate-200 px-3 py-3">
                ब्याण्डिङ किसिम
              </th>

              <th className="w-40 border-b border-r border-slate-200 px-3 py-3">
                डिजाइन मिति / व्यक्ति
              </th>

              <th className="w-40 border-b border-r border-slate-200 px-3 py-3">
                छपाइ मिति / व्यक्ति
              </th>

              <th className="w-40 border-b border-r border-slate-200 px-3 py-3">
                ब्याण्डर मिति / व्यक्ति
              </th>

              <th className="w-32 border-b border-r border-slate-200 px-3 py-3">
                कार्य प्रकार
              </th>

              <th className="w-32 border-b border-slate-200 px-3 py-3">रकम</th>

              <th className="w-28 border-b border-slate-200 px-3 py-3">
                Action
              </th>
            </tr>
          </thead>

          {/* =====================================
              BODY
          ====================================== */}

          <tbody>
            {fields.map((field, index) => (
              <tr
                key={field.id}
                className="group transition hover:bg-orange-50/30 dark:hover:bg-slate-800"
              >
                {/* S.N */}
                <td className="border-b border-r border-slate-200 px-3 py-3 text-center">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                </td>

                {/* DESCRIPTION */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.description`)}
                    placeholder="Item description"
                    className="w-full rounded-lg bg-transparent px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* QUANTITY */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="number"
                    min="1"
                    {...register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-2 py-2.5 text-center text-sm font-medium text-slate-700 outline-none  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* RATE */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register(`items.${index}.rate`, {
                      valueAsNumber: true,
                    })}
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-2 py-2.5 text-right text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* SIZE */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.size`)}
                    placeholder="Size"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-2 py-2.5 text-center text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* INK */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.ink`)}
                    placeholder="Ink"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-2 py-2.5 text-center text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* PAPER TYPE */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.paperType`)}
                    placeholder="Paper type"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* BINDING TYPE */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.bindingType`)}
                    placeholder="Binding"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* DESIGN */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.designDatePerson`)}
                    placeholder="Date / Person"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* PRINTING */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.printingDatePerson`)}
                    placeholder="Date / Person"
                    className="w-full rounded-lg dark:text-slate-300 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* BINDING DATE / PERSON */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.bindingDatePerson`)}
                    placeholder="Date / Person"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* WORK TYPE */}
                <td className="border-b border-r border-slate-200 p-1">
                  <input
                    type="text"
                    {...register(`items.${index}.workType`)}
                    placeholder="Work type"
                    className="w-full rounded-lg bg-transparent dark:text-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300  focus:ring-2 focus:ring-orange-100"
                  />
                </td>

                {/* AMOUNT */}
                <td className="border-b border-r border-slate-200 px-3 py-3 text-right">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-600 px-3 py-2.5">
                    <span className="text-xs text-slate-400">Rs.</span>

                    <span className="ml-1 font-semibold text-slate-700 dark:text-slate-300">
                      {calculateAmount(index).toLocaleString("en-IN")}
                    </span>
                  </div>
                </td>

                {/* ACTION */}
                <td className="border-b border-slate-200 px-2 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      title="Delete item"
                      className="flex h-9 w-9 items-center  justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:border-red-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <FaTrash className="text-xs" />
                    </button>

                    {/* ADD */}
                    <button
                      type="button"
                      onClick={addRow}
                      title="Add item"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-orange-600 transition hover:border-orange-200 hover:bg-orange-100"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================
          BOTTOM SUMMARY
      ========================================== */}

      <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 dark:bg-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FaCalculator className="text-orange-500" />

          <span>Amount is calculated automatically from quantity × rate.</span>
        </div>

        {/* TOTAL */}
        <div className="flex items-center justify-between gap-6 sm:justify-end">
          <div className="text-right">
            <p className="text-xs font-medium text-slate-400">Items Total</p>

            <p className="text-xl font-bold text-slate-800">
              Rs. {totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateItems;
