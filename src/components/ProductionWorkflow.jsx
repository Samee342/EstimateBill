import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiLock,
  FiPlay,
  FiPrinter,
  FiScissors,
  FiLayers,
  FiUser,
  FiRefreshCw,
  FiAlertCircle,
  FiPackage,
  FiCalendar,
  FiChevronRight,
  FiHash,
} from "react-icons/fi";

import { assignedWork, createAssignedWork } from "../api/staffWork";

// =========================================================
// STAGE CONFIGURATION
// =========================================================

const STAGE_CONFIG = [
  {
    key: "designing",
    name: "Designing",
    icon: FiLayers,
    department: "Designer",
    personField: "Designing_person",
    detailsField: "designing_person_details",
    statusField: "designing_status",
  },
  {
    key: "printing",
    name: "Printing",
    icon: FiPrinter,
    department: "Printer",
    personField: "printing_person",
    detailsField: "printing_person_details",
    statusField: "printing_status",
  },
  {
    key: "binding",
    name: "Binding",
    icon: FiScissors,
    department: "Binding",
    personField: "binding_person",
    detailsField: "binding_person_details",
    statusField: "binding_status",
  },
];

// =========================================================
// STATUS HELPERS
// =========================================================

const normalizeStatus = (value) => {
  const status = String(value || "waiting")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

  if (
    ["completed", "complete", "finished", "done", "printed"].includes(status)
  ) {
    return "completed";
  }

  if (
    [
      "in_progress",
      "inprogress",
      "processing",
      "started",
      "working",
      "ongoing",
    ].includes(status)
  ) {
    return "in_progress";
  }

  // Includes "waiting", the backend typo "wating",
  // "pending", "assigned", and unknown initial statuses.
  return "pending";
};

const getStatusLabel = (status) => {
  if (status === "completed") return "Completed";
  if (status === "in_progress") return "In Progress";
  return "Pending";
};

const getStatusClasses = (status) => {
  if (status === "completed") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "in_progress") {
    return "border-orange-200 bg-orange-50 text-orange-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
};

// =========================================================
// API RESPONSE HELPERS
// =========================================================

const getRecords = (response) => {
  const candidates = [
    response,
    response?.data,
    response?.results,
    response?.assignments,
    response?.slipassignworks,
    response?.data?.results,
    response?.data?.data,
    response?.data?.assignments,
    response?.data?.slipassignworks,
    response?.data?.orders,
  ];

  return candidates.find(Array.isArray) || [];
};

const getLoggedInUser = () => {
  const keys = ["user", "currentUser", "authUser", "userData", "staff"];

  for (const key of keys) {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || "null");

      if (!stored || typeof stored !== "object") continue;

      const user = stored.user || stored.staff || stored.data || stored;

      if (
        user.id != null ||
        user.pk != null ||
        user.user_id != null ||
        user.username ||
        user.email
      ) {
        return {
          ...user,
          id: user.id ?? user.pk ?? user.user_id,
          username:
            user.username ?? user.user_name ?? user.full_name ?? user.name,
          role: user.role ?? stored.role ?? localStorage.getItem("role"),
        };
      }
    } catch {
      // Continue checking the other possible storage keys.
    }
  }

  return {
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  };
};

const getPersonName = (person) => {
  if (person == null) return "";

  if (typeof person === "string" || typeof person === "number") {
    return String(person);
  }

  return (
    person.username || person.full_name || person.name || person.email || ""
  );
};

const isAssignedToUser = (item, stage, user) => {
  const personId = item?.[stage.personField];
  const personDetails = item?.[stage.detailsField];

  if (user?.id != null) {
    if (personId != null) {
      return String(personId) === String(user.id);
    }

    if (personDetails?.id != null) {
      return String(personDetails.id) === String(user.id);
    }

    return false;
  }

  if (user?.username) {
    const assignedUsername = String(
      personDetails?.username || "",
    ).toLowerCase();

    if (assignedUsername) {
      return assignedUsername === String(user.username).toLowerCase();
    }

    return false;
  }

  // When identity is unavailable, rely on assignedWork() returning
  // records scoped to the authenticated staff member.
  return personId != null || personDetails != null;
};

// =========================================================
// ORDER / PROJECT HELPERS
// =========================================================

const getOrder = (item) => {
  const order =
    item?.order_details ||
    item?.current_order ||
    item?.project_details ||
    item?.order ||
    item?.project;

  return order && typeof order === "object" ? order : {};
};

const getProjectName = (item) => {
  const order = getOrder(item);
  const customer = order.customer_details || {};

  return (
    order.project_name ||
    order.projectName ||
    order.order_name ||
    order.name ||
    order.title ||
    item?.project_name ||
    item?.order_name ||
    item?.slip_name ||
    (order.slip_no != null
      ? `Project ${order.slip_no}`
      : item?.slip_no != null
        ? `Project ${item.slip_no}`
        : "") ||
    customer.name ||
    item?.item_description ||
    "Production Project"
  );
};

const getProjectNumber = (item) => {
  const order = getOrder(item);

  return (
    order.slip_no ??
    order.slip_number ??
    item?.slip_no ??
    item?.slip_number ??
    item?.order_slip_no ??
    "—"
  );
};

const getEstimateNumber = (item) => {
  const number = getProjectNumber(item);

  if (number === "—") return "—";

  const value = String(number);

  return /^EST-/i.test(value) ? value : `EST-${value}`;
};

const getCustomerName = (item) => {
  const order = getOrder(item);
  const customer =
    order.customer_details || order.customer_info || order.customer_data || {};

  return (
    getPersonName(customer) ||
    order.customer_name ||
    item?.customer_name ||
    "Customer not available"
  );
};

const getDueDate = (item) => {
  const order = getOrder(item);

  return (
    order.delivery_date ||
    order.due_date ||
    order.expected_delivery_date ||
    item?.delivery_date ||
    item?.due_date ||
    ""
  );
};

const getStageName = (item) => {
  const value =
    item?.work_stage_details?.name ||
    item?.work_stage_details?.stage_name ||
    item?.work_stage?.name ||
    item?.work_stage_name ||
    item?.stage_name ||
    item?.stage ||
    item?.department_details?.name ||
    item?.department ||
    item?.work_stage ||
    "";

  if (typeof value === "object" && value !== null) {
    return value.name || value.stage_name || value.title || "";
  }

  return String(value);
};

const getLegacyStage = (item) => {
  const name = getStageName(item).toLowerCase();

  if (name.includes("design")) return STAGE_CONFIG[0];
  if (name.includes("print")) return STAGE_CONFIG[1];
  if (name.includes("bind")) return STAGE_CONFIG[2];

  return null;
};

const getStaffName = (item, stage, user) => {
  return (
    getPersonName(item?.[stage.detailsField]) ||
    getPersonName(
      item?.staff_details ||
        item?.assigned_to_details ||
        item?.employee_details ||
        item?.user_details ||
        item?.staff ||
        item?.assigned_to ||
        item?.employee,
    ) ||
    item?.staff_name ||
    item?.assigned_to_name ||
    item?.employee_name ||
    user?.username ||
    "Assigned staff"
  );
};

// =========================================================
// NORMALIZE BOTH SUPPORTED API SHAPES
// =========================================================

// Preferred API shape:
// {
//   id, order, order_details,
//   Designing_person, designing_status,
//   printing_person, printing_status,
//   binding_person, binding_status
// }
//
// Legacy API shape:
// {
//   id, work_stage, status, staff_details, order_details
// }

const expandAssignments = (records, user) => {
  const result = [];

  records.forEach((item) => {
    if (!item || item.id == null) return;

    const hasStageFields = STAGE_CONFIG.some(
      (stage) =>
        Object.prototype.hasOwnProperty.call(item, stage.statusField) ||
        Object.prototype.hasOwnProperty.call(item, stage.personField) ||
        Object.prototype.hasOwnProperty.call(item, stage.detailsField),
    );

    if (hasStageFields) {
      STAGE_CONFIG.forEach((stage) => {
        if (!isAssignedToUser(item, stage, user)) return;

        result.push({
          id: `${item.id}-${stage.key}`,
          itemId: item.id,
          stage,
          status: normalizeStatus(item[stage.statusField]),
          staffName: getStaffName(item, stage, user),
          item,
          statusField: stage.statusField,
          isLegacy: false,
        });
      });

      return;
    }

    // Backward compatibility for separate stage-assignment records.
    const legacyStage = getLegacyStage(item);

    if (!legacyStage) return;

    const legacyStaff =
      item?.staff_details ||
      item?.assigned_to_details ||
      item?.employee_details ||
      item?.user_details ||
      {};

    const legacyPersonId =
      item?.staff ??
      item?.staff_id ??
      item?.assigned_to ??
      item?.employee ??
      legacyStaff?.id;

    const userMatches =
      user?.id != null && legacyPersonId != null
        ? String(user.id) === String(legacyPersonId)
        : user?.username
          ? String(legacyStaff?.username || "").toLowerCase() ===
            String(user.username).toLowerCase()
          : true;

    if (!userMatches) return;

    result.push({
      id: String(item.id),
      itemId: item.id,
      stage: legacyStage,
      status: normalizeStatus(
        item.status || item.work_status || item.current_status,
      ),
      staffName:
        getPersonName(legacyStaff) || getStaffName(item, legacyStage, user),
      item,
      statusField: null,
      isLegacy: true,
    });
  });

  return result;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const ProductionWorkflow = ({ taskId }) => {
  const [records, setRecords] = useState([]);
  const [selectedStage, setSelectedStage] = useState("designing");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const user = useMemo(() => getLoggedInUser(), []);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await assignedWork();
      const fetchedRecords = getRecords(response);

      setRecords(fetchedRecords);
    } catch (err) {
      console.error("Failed to fetch production assignments:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to load production assignments. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // If embedded inside a task-details page, show only that work item.
  // The item ID is preferred; order ID is also supported as a fallback.
  const scopedRecords = useMemo(() => {
    if (taskId == null || taskId === "") return records;

    const id = String(taskId);

    const itemMatches = records.filter((item) => String(item?.id) === id);

    if (itemMatches.length) return itemMatches;

    return records.filter((item) => {
      const order = getOrder(item);

      return String(item?.order ?? order?.id ?? "") === id;
    });
  }, [records, taskId]);

  const assignments = useMemo(
    () => expandAssignments(scopedRecords, user),
    [scopedRecords, user],
  );

  // Stage summaries are calculated from actual assigned work.
  const stages = useMemo(() => {
    return STAGE_CONFIG.map((config, index) => {
      const stageAssignments = assignments.filter(
        (assignment) => assignment.stage.key === config.key,
      );

      const completedCount = stageAssignments.filter(
        (assignment) => assignment.status === "completed",
      ).length;

      const inProgressCount = stageAssignments.filter(
        (assignment) => assignment.status === "in_progress",
      ).length;

      let status = "pending";

      if (
        stageAssignments.length > 0 &&
        completedCount === stageAssignments.length
      ) {
        status = "completed";
      } else if (inProgressCount > 0 || completedCount > 0) {
        status = "in_progress";
      }

      return {
        ...config,
        index,
        assignments: stageAssignments,
        completedCount,
        inProgressCount,
        status,
      };
    });
  }, [assignments]);

  const currentStage =
    stages.find((stage) => stage.key === selectedStage) || stages[0];

  const completedAssignments = assignments.filter(
    (assignment) => assignment.status === "completed",
  ).length;

  const inProgressAssignments = assignments.filter(
    (assignment) => assignment.status === "in_progress",
  ).length;

  const totalAssignments = assignments.length;

  const progress = totalAssignments
    ? Math.round((completedAssignments / totalAssignments) * 100)
    : 0;

  // The selected assignment's preceding production stages are checked
  // against the original item, not against other projects.
  const isStageLocked = (assignment) => {
    if (assignment.isLegacy) {
      // Legacy records may not contain the other stage statuses.
      return false;
    }

    const previousStages = STAGE_CONFIG.filter(
      (stage) => stage.key !== assignment.stage.key,
    ).filter(
      (stage) =>
        (stage.key === "designing" && assignment.stage.key !== "designing") ||
        (stage.key === "printing" && assignment.stage.key === "binding"),
    );

    return previousStages.some((stage) => {
      const rawStatus = assignment.item?.[stage.statusField];

      return normalizeStatus(rawStatus) !== "completed";
    });
  };

  // =======================================================
  // UPDATE ONE ASSIGNED STAGE
  // =======================================================

  const handleStageAction = async (assignment, action) => {
    if (!assignment || updatingId !== null) return;

    const nextStatus = action === "complete" ? "completed" : "in_progress";

    try {
      setUpdatingId(assignment.id);
      setError("");
      setNotice("");

      if (assignment.isLegacy) {
        // Legacy endpoint support: use the same status-field update
        // contract as the main API helper. If your legacy endpoint
        // uses a different route, adjust it in staffWork.js.
        await createAssignedWork(assignment.itemId, "status", nextStatus);
      } else {
        // Only the selected stage's status field is changed.
        // Example: designing_status = "in_progress".
        await createAssignedWork(
          assignment.itemId,
          assignment.statusField,
          nextStatus,
        );
      }

      setNotice(
        `${assignment.stage.name} ${
          action === "complete" ? "completed" : "started"
        } successfully.`,
      );

      await fetchAssignments();
    } catch (err) {
      console.error("Failed to update production stage:", {
        status: err?.response?.status,
        data: err?.response?.data,
        url: err?.config?.url,
        body: err?.config?.data,
      });

      const data = err?.response?.data;

      setError(
        data?.detail ||
          data?.message ||
          data?.error ||
          (data && typeof data === "object"
            ? JSON.stringify(data)
            : "Unable to update this stage. Please check the backend response."),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <FiRefreshCw className="mx-auto animate-spin text-2xl text-orange-500" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Loading production assignments...
        </p>
      </div>
    );
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="space-y-5 text-slate-800 dark:text-slate-100">
      {/* Messages */}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
        >
          <FiAlertCircle className="mt-0.5 shrink-0" size={17} />
          <p className="break-words">{error}</p>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
        >
          <FiCheckCircle className="mt-0.5 shrink-0" size={17} />
          <p>{notice}</p>
        </div>
      )}

      {/* Header */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            Production tracking
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            My Production Stages
          </h2>

          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
            Track and update each stage assigned to you.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAssignments}
          disabled={loading || updatingId !== null}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/40 dark:hover:text-orange-400 sm:self-auto"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Empty state */}

      {assignments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
            <FiPackage size={23} />
          </div>

          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
            No assigned production stages
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            No production stages matched this staff member. Verify the logged-in
            user ID, the stage person IDs, and the API response.
          </p>

          <button
            type="button"
            onClick={fetchAssignments}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <FiRefreshCw size={14} />
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Summary */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Assigned Stages"
              value={totalAssignments}
              icon={FiLayers}
              tone="orange"
            />

            <SummaryCard
              label="In Progress"
              value={inProgressAssignments}
              icon={FiClock}
              tone="amber"
            />

            <SummaryCard
              label="Completed"
              value={completedAssignments}
              icon={FiCheckCircle}
              tone="green"
            />
          </div>

          {/* Progress */}

          <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  My Overall Progress
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Based only on your assigned production stages
                </p>
              </div>

              <p className="text-2xl font-bold text-orange-500">{progress}%</p>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {completedAssignments} of {totalAssignments} assigned stages
              completed
            </p>
          </section>

          {/* Stage tabs */}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Production Workflow
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Select Designing, Printing, or Binding to see the matching
                assignments.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-3 sm:p-4">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const isSelected = stage.key === currentStage.key;
                const stageCount = stage.assignments.length;

                return (
                  <button
                    key={stage.key}
                    type="button"
                    onClick={() => setSelectedStage(stage.key)}
                    className={`rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-orange-300 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10"
                        : "border-slate-200 bg-white hover:border-orange-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-orange-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          stage.status === "completed"
                            ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                            : stage.status === "in_progress"
                              ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-bold ${getStatusClasses(
                          stage.status,
                        )}`}
                      >
                        {getStatusLabel(stage.status)}
                      </span>
                    </div>

                    <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                      {stage.name}
                    </h4>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {stageCount} assigned item{stageCount === 1 ? "" : "s"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected stage assignments */}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <currentStage.icon size={20} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentStage.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {currentStage.department} department
                  </p>
                </div>
              </div>

              <span className="self-start rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:self-auto">
                {currentStage.assignments.length} item
                {currentStage.assignments.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-3 p-3 sm:p-5">
              {currentStage.assignments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 px-4 py-9 text-center dark:border-slate-700">
                  <FiLayers size={24} className="mx-auto text-slate-400" />
                  <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-white">
                    No {currentStage.name.toLowerCase()} assignments
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    You have no matching assignments for this stage.
                  </p>
                </div>
              ) : (
                currentStage.assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    locked={isStageLocked(assignment)}
                    updating={updatingId === assignment.id}
                    disabled={updatingId !== null}
                    onStart={() => handleStageAction(assignment, "start")}
                    onComplete={() => handleStageAction(assignment, "complete")}
                  />
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({ label, value, icon: Icon, tone }) => {
  const tones = {
    orange:
      "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    green:
      "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            tones[tone] || tones.orange
          }`}
        >
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
};

// =========================================================
// ASSIGNMENT CARD
// =========================================================

const AssignmentCard = ({
  assignment,
  locked,
  updating,
  disabled,
  onStart,
  onComplete,
}) => {
  const item = assignment.item;
  const order = getOrder(item);
  const status = assignment.status;

  const customer = getCustomerName(item);
  const projectName = getProjectName(item);
  const projectNumber = getEstimateNumber(item);
  const dueDate = getDueDate(item);

  const itemDescription =
    item?.item_description ||
    item?.description ||
    item?.name ||
    "Production item";

  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";

  return (
    <article className="rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <FiHash size={11} />
                {projectNumber}
              </span>

              <StatusBadge status={status} />
            </div>

            <h4 className="mt-3 break-words text-sm font-bold text-slate-900 dark:text-white">
              {projectName}
            </h4>

            <p className="mt-1 break-words text-xs leading-5 text-slate-500 dark:text-slate-400">
              {itemDescription}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoLine icon={FiUser} label="Customer" value={customer} />
              <InfoLine
                icon={FiUser}
                label="Assigned staff"
                value={assignment.staffName}
              />

              {dueDate && (
                <InfoLine
                  icon={FiCalendar}
                  label="Delivery date"
                  value={formatDate(dueDate)}
                />
              )}

              {item?.quantity != null && (
                <InfoLine
                  icon={FiPackage}
                  label="Quantity"
                  value={item.quantity}
                />
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            {isCompleted ? (
              <FiCheckCircle
                size={15}
                className="text-green-600 dark:text-green-400"
              />
            ) : isInProgress ? (
              <FiPlay
                size={14}
                className="text-orange-600 dark:text-orange-400"
              />
            ) : (
              <FiClock
                size={15}
                className="text-amber-600 dark:text-amber-400"
              />
            )}

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {getStatusLabel(status)}
            </span>
          </div>
        </div>

        {/* Stage-specific actions */}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          {status === "pending" && (
            <button
              type="button"
              onClick={onStart}
              disabled={disabled || locked}
              title={
                locked
                  ? "The preceding production stage must be completed first."
                  : "Start this production stage"
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locked ? <FiLock size={14} /> : <FiPlay size={14} />}
              {updating
                ? "Updating..."
                : locked
                  ? "Previous Stage Pending"
                  : "Start Work"}
            </button>
          )}

          {status === "in_progress" && (
            <button
              type="button"
              onClick={onComplete}
              disabled={disabled}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiCheck size={14} />
              {updating ? "Updating..." : "Mark Completed"}
            </button>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3.5 py-2.5 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <FiCheckCircle size={14} />
              This stage is completed
            </span>
          )}

          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <FiLayers size={12} />
            {assignment.stage.name}
          </span>
        </div>
      </div>
    </article>
  );
};

// =========================================================
// SMALL UI COMPONENTS
// =========================================================

const InfoLine = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-start gap-2">
    <Icon size={13} className="mt-0.5 shrink-0 text-slate-400" />

    <div className="min-w-0">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-xs font-medium text-slate-700 dark:text-slate-300">
        {value || "—"}
      </p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusClasses(
      status,
    )}`}
  >
    {status === "completed" ? (
      <FiCheck size={11} />
    ) : status === "in_progress" ? (
      <FiPlay size={10} />
    ) : (
      <FiClock size={11} />
    )}

    {getStatusLabel(status)}
  </span>
);

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsed = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? `${date}T00:00:00` : date,
  );

  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default ProductionWorkflow;
