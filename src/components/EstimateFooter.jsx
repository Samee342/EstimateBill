import React from "react";

const EstimateFooter = ({ register }) => {
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">
          छपाइको पूर्ण विवरण
        </h3>
      </div>

      {/* Input */}
      <div>
        <label
          htmlFor="printingDetails"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          विवरण
        </label>

        <textarea
          id="printingDetails"
          rows={4}
          {...(register ? register("printingDetails") : {})}
          className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
        />
      </div>
    </div>
  );
};

export default EstimateFooter;
