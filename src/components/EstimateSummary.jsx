import React from "react";
import { useWatch } from "react-hook-form";
import {
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";

const EstimateSummary = ({ control, register }) => {
  /*
    Watch values from the form
  */
  const items = useWatch({
    control,
    name: "items",
  });

  const advance = useWatch({
    control,
    name: "advance",
  });

  /*
    Calculate total from estimate items
  */
  const totalAmount =
    items?.reduce((total, item) => {
      const quantity = Number(item?.quantity) || 0;
      const rate = Number(item?.rate) || 0;

      return total + quantity * rate;
    }, 0) || 0;

  /*
    Calculate remaining amount
  */
  const advanceAmount = Number(advance) || 0;

  const remainingAmount = Math.max(totalAmount - advanceAmount, 0);

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          SECTION HEADER
      ========================================== */}

      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <FaMoneyBillWave className="text-sm" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-800">Estimate Summary</h2>

          <p className="mt-1 text-xs text-slate-400">
            Review payment, delivery and proof details.
          </p>
        </div>
      </div>

      {/* =========================================
          PAYMENT & DATE SECTION
      ========================================== */}

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* TOTAL AMOUNT */}
        <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <FaMoneyBillWave className="text-xs" />
            </div>

            <span className="text-xs font-medium text-slate-500">
              जम्मा रकम
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-400">Rs.</span>

            <span className="text-xl font-bold text-slate-800">
              {totalAmount.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Hidden form value */}
          <input
            type="hidden"
            {...register("totalAmount", {
              valueAsNumber: true,
            })}
            value={totalAmount}
            readOnly
          />
        </div>

        {/* ADVANCE */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FaHandHoldingUsd className="text-xs" />
            </div>
            पेस्की
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              Rs.
            </span>

            <input
              type="number"
              min="0"
              max={totalAmount}
              {...register("advance", {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              placeholder="0"
            />
          </div>
        </div>

        {/* REMAINING */}
        <div
          className={`rounded-xl border p-4 ${
            remainingAmount > 0
              ? "border-red-100 bg-red-50/50"
              : "border-green-100 bg-green-50/50"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                remainingAmount > 0
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-600"
              }`}
            >
              <FaMoneyBillWave className="text-xs" />
            </div>

            <span className="text-xs font-medium text-slate-500">बाँकी</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-slate-400">Rs.</span>

            <span
              className={`text-xl font-bold ${
                remainingAmount > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {remainingAmount.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Hidden form value */}
          <input
            type="hidden"
            {...register("remaining", {
              valueAsNumber: true,
            })}
            value={remainingAmount}
            readOnly
          />
        </div>

        {/* DELIVERY DATE */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FaCalendarAlt className="text-xs" />
            </div>
            सामान दिने मिति
          </label>

          <input
            type="date"
            {...register("deliveryDate")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* PAYMENT DATE */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FaCalendarAlt className="text-xs" />
            </div>
            रकम चुक्ता गर्ने मिति
          </label>

          <input
            type="date"
            {...register("paymentDate")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>

      {/* =========================================
          PAYMENT STATUS
      ========================================== */}

      <div className="mx-5 mb-5 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-orange-500" />

            <span className="text-xs font-medium text-slate-500">
              Payment Status
            </span>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              remainingAmount === 0
                ? "bg-green-100 text-green-700"
                : advanceAmount > 0
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-600"
            }`}
          >
            {remainingAmount === 0
              ? "Paid"
              : advanceAmount > 0
                ? "Partially Paid"
                : "Pending"}
          </span>
        </div>
      </div>

      {/* =========================================
          PROOF METHOD
      ========================================== */}

      <div className="border-t border-slate-100 px-5 py-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <FaFileAlt className="text-sm" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700">
              पुरुफ गर्ने तरिका
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Select how the customer proof will be handled.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* SHOW */}
          <label className="group cursor-pointer">
            <input
              type="radio"
              value="देखाउने"
              {...register("proofMethod")}
              className="peer sr-only"
            />

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition group-hover:border-orange-200 peer-checked:border-orange-500 peer-checked:bg-orange-50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition peer-checked:bg-orange-100 peer-checked:text-orange-600">
                <FaCheckCircle className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">देखाउने</p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Show proof before printing
                </p>
              </div>
            </div>
          </label>

          {/* SAMPLE */}
          <label className="group cursor-pointer">
            <input
              type="radio"
              value="नमूना अनुसार"
              {...register("proofMethod")}
              className="peer sr-only"
            />

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition group-hover:border-orange-200 peer-checked:border-orange-500 peer-checked:bg-orange-50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FaFileAlt className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  नमूना अनुसार
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Follow provided sample
                </p>
              </div>
            </div>
          </label>

          {/* COMPUTER */}
          <label className="group cursor-pointer">
            <input
              type="radio"
              value="कम्प्युटरमा भएको"
              {...register("proofMethod")}
              className="peer sr-only"
            />

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition group-hover:border-orange-200 peer-checked:border-orange-500 peer-checked:bg-orange-50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FaFileAlt className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  कम्प्युटरमा भएको
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Use existing computer file
                </p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default EstimateSummary;
