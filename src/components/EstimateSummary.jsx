import React from "react";
import { FaMoneyBillWave, FaCheckCircle, FaFileAlt } from "react-icons/fa";

const EstimateSummary = ({ register }) => {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:bg-slate-800">
      {/* SECTION HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <FaMoneyBillWave className="text-sm" />
        </div>

        <div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-300">
            Estimate Summary
          </h2>

          <p className="mt-1 text-xs text-slate-400">Review proof details.</p>
        </div>
      </div>

      {/* PROOF METHOD */}
      <div className="px-5 py-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-700">
            <FaFileAlt className="text-sm" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              प्रुफ गर्ने तरिका
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

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 group-hover:border-orange-300 peer-checked:border-orange-600 peer-checked:bg-orange-100 dark:bg-slate-800 dark:peer-checked:bg-orange-950/50 dark:peer-checked:border-orange-500">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition peer-checked:bg-orange-200 peer-checked:text-orange-700 dark:bg-slate-700 dark:peer-checked:bg-orange-900 dark:peer-checked:text-orange-300">
                <FaCheckCircle className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  देखाउने
                </p>
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

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 group-hover:border-orange-300 peer-checked:border-orange-600 peer-checked:bg-orange-100 dark:bg-slate-800 dark:peer-checked:bg-orange-950/50 dark:peer-checked:border-orange-500">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition peer-checked:bg-orange-200 peer-checked:text-orange-700 dark:bg-slate-700 dark:peer-checked:bg-orange-900 dark:peer-checked:text-orange-300">
                <FaFileAlt className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 group-hover:border-orange-300 peer-checked:border-orange-600 peer-checked:bg-orange-100 dark:bg-slate-800 dark:peer-checked:bg-orange-950/50 dark:peer-checked:border-orange-500">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition peer-checked:bg-orange-200 peer-checked:text-orange-700 dark:bg-slate-700 dark:peer-checked:bg-orange-900 dark:peer-checked:text-orange-300">
                <FaFileAlt className="text-sm" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
