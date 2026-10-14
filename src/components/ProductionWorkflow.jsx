import React, { useState } from "react";
import {
  FiCheck,
  FiClock,
  FiLock,
  FiPlay,
  FiPrinter,
  FiScissors,
  FiLayers,
  FiUser,
  FiArrowRight,
} from "react-icons/fi";

const initialStages = [
  {
    id: 1,
    name: "Designing",
    description: "Prepare the design and finalize the layout.",
    staff: "Anisha Sharma",
    department: "Designer",
    icon: FiLayers,
    status: "completed",
  },
  {
    id: 2,
    name: "Printing",
    description: "Print the approved design on the selected paper.",
    staff: "Ramesh Thapa",
    department: "Printer",
    icon: FiPrinter,
    status: "pending",
  },
  {
    id: 3,
    name: "Binding",
    description: "Complete binding and finishing work.",
    staff: "Suman Chaudhary",
    department: "Binding",
    icon: FiScissors,
    status: "pending",
  },
];

const statusConfig = {
  completed: {
    label: "Completed",
    color:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  "in-progress": {
    label: "In Progress",
    color:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  },
  pending: {
    label: "Waiting",
    color:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
};

const ProductionWorkflow = ({
  projectName = "Visiting Cards",
  projectNumber = "PT-0018",
}) => {
  const [stages, setStages] = useState(initialStages);

  const completedCount = stages.filter(
    (stage) => stage.status === "completed",
  ).length;

  const progress = Math.round((completedCount / stages.length) * 100);

  const handleStart = (stageId) => {
    setStages((currentStages) =>
      currentStages.map((stage) =>
        stage.id === stageId ? { ...stage, status: "in-progress" } : stage,
      ),
    );
  };

  const handleComplete = (stageId) => {
    setStages((currentStages) =>
      currentStages.map((stage) =>
        stage.id === stageId ? { ...stage, status: "completed" } : stage,
      ),
    );
  };

  const getStageState = (stage, index) => {
    if (stage.status === "completed") return "completed";

    if (stage.status === "in-progress") return "in-progress";

    // A stage is available only when the previous stage is completed.
    if (index === 0 || stages[index - 1].status === "completed") {
      return "ready";
    }

    return "locked";
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <FiLayers size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Production Workflow
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Track the progress of each production stage.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {projectNumber}
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-slate-500 dark:text-slate-400">
              {projectName}
            </span>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {progress}%
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Overall progress
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage stepper */}
      <div className="mt-7 grid grid-cols-3 gap-2">
        {stages.map((stage, index) => {
          const stageState = getStageState(stage, index);
          const StageIcon = stage.icon;

          return (
            <div key={stage.id} className="relative">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                    stageState === "completed"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : stageState === "ready" || stageState === "in-progress"
                        ? "border-orange-500 bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                        : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  {stageState === "completed" ? (
                    <FiCheck size={19} />
                  ) : stageState === "locked" ? (
                    <FiLock size={17} />
                  ) : (
                    <StageIcon size={19} />
                  )}
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200 sm:text-sm">
                  {stage.name}
                </p>

                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {stageState === "completed"
                    ? "Finished"
                    : stageState === "in-progress"
                      ? "In progress"
                      : stageState === "ready"
                        ? "Ready to start"
                        : "Locked"}
                </p>
              </div>

              {index < stages.length - 1 && (
                <div className="absolute left-[calc(50%+27px)] right-[calc(-50%+27px)] top-[21px] hidden h-px bg-slate-200 dark:bg-slate-700 sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Workflow stages */}
      <div className="mt-7 space-y-3">
        {stages.map((stage, index) => {
          const stageState = getStageState(stage, index);
          const StageIcon = stage.icon;
          const status = statusConfig[stage.status];

          return (
            <div
              key={stage.id}
              className={`rounded-lg border p-4 transition-colors ${
                stageState === "ready" || stageState === "in-progress"
                  ? "border-orange-200 bg-orange-50/40 dark:border-orange-500/20 dark:bg-orange-500/[0.04]"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Stage icon and details */}
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      stageState === "completed"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : stageState === "locked"
                          ? "bg-slate-100 text-slate-400 dark:bg-slate-800"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                    }`}
                  >
                    {stageState === "locked" ? (
                      <FiLock size={18} />
                    ) : stageState === "completed" ? (
                      <FiCheck size={19} />
                    ) : (
                      <StageIcon size={19} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {stage.name}
                      </h3>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${status.color}`}
                      >
                        {stageState === "locked"
                          ? "Locked"
                          : stageState === "ready"
                            ? "Ready"
                            : status.label}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {stage.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiUser size={13} />
                        {stage.staff}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <FiLayers size={13} />
                        {stage.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage action */}
                <div className="shrink-0 sm:ml-3">
                  {stageState === "completed" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <FiCheck size={16} />
                      Done
                    </span>
                  ) : stageState === "locked" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                      <FiLock size={14} />
                      Waiting
                    </span>
                  ) : stageState === "ready" ? (
                    <button
                      type="button"
                      onClick={() => handleStart(stage.id)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:w-auto"
                    >
                      <FiPlay size={14} />
                      Start {stage.name}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleComplete(stage.id)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 sm:w-auto"
                    >
                      <FiCheck size={15} />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-5 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-3 text-xs leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
        <FiClock className="mt-0.5 shrink-0" size={14} />
        <p>
          Complete each production stage to unlock the next one. Changes are
          temporary and will reset when this component reloads because it
          currently uses template data.
        </p>
      </div>
    </section>
  );
};

export default ProductionWorkflow;
