import { useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiPackage,
  FiPrinter,
  FiSearch,
  FiTool,
  FiUser,
  FiX,
  FiLayers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { assignedWork } from "../../api/staffWork";

// =========================================================
// API RESPONSE HELPERS
// =========================================================

const getArrayFromResponse = (response) => {
  let data = response?.data ?? response;

  for (let i = 0; i < 8; i++) {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];

    const keys = [
      "results",
      "tasks",
      "work",
      "assigned_work",
      "assigned_tasks",
      "work_items",
      "items",
      "orders",
    ];

    const found = keys.find((key) => Array.isArray(data[key]));
    if (found) return data[found];

    if (data.data !== undefined) {
      data = data.data;
      continue;
    }

    break;
  }

  console.warn("[StaffTasks] Could not find task array:", response);
  return [];
};

const getNested = (object, paths, fallback = "") => {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce((current, key) => current?.[key], object);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

const asDisplayName = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    return (
      value.name ??
      value.customer_name ??
      value.company_name ??
      value.username ??
      ""
    );
  }

  return "";
};

// =========================================================
// CURRENT STAFF
// =========================================================

// Read the logged-in user from common localStorage keys.
// If your application uses another key, add it here.
const getCurrentStaff = () => {
  if (typeof localStorage === "undefined") return null;

  const keys = ["user", "currentUser", "authUser", "staff", "userData"];

  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;

      const parsed = JSON.parse(value);
      const user = parsed?.user ?? parsed?.data?.user ?? parsed;

      if (user && typeof user === "object") {
        const id = user.id ?? user.user_id ?? user.staff_id ?? user.profile?.id;

        if (id !== undefined && id !== null) {
          return {
            id: String(id),
            username: user.username ?? user.name ?? "",
          };
        }
      }
    } catch {
      // Ignore storage values that are not valid JSON.
    }
  }

  return null;
};

// =========================================================
// STATUS HELPERS
// =========================================================

const normalizeStageStatus = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Unknown";
  }

  const status = String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (
    [
      "pending",
      "waiting",
      "wating",
      "not_started",
      "assigned",
      "todo",
      "queued",
    ].includes(status)
  ) {
    return "Pending";
  }

  if (
    [
      "in_progress",
      "inprogress",
      "started",
      "processing",
      "working",
      "ongoing",
    ].includes(status)
  ) {
    return "In Progress";
  }

  if (
    ["completed", "complete", "finished", "done", "printed"].includes(status)
  ) {
    return "Completed";
  }

  return "Unknown";
};

// =========================================================
// STAGE ASSIGNMENTS
// =========================================================

const STAGE_CONFIG = [
  {
    key: "designing",
    label: "Designing",
    personKeys: ["Designing_person", "designing_person"],
    detailKey: "designing_person_details",
    statusKey: "designing_status",
    icon: FiTool,
  },
  {
    key: "printing",
    label: "Printing",
    personKeys: ["printing_person", "Printing_person"],
    detailKey: "printing_person_details",
    statusKey: "printing_status",
    icon: FiPrinter,
  },
  {
    key: "binding",
    label: "Binding",
    personKeys: ["binding_person", "Binding_person"],
    detailKey: "binding_person_details",
    statusKey: "binding_status",
    icon: FiLayers,
  },
];

const getStagePersonId = (raw, config) => {
  for (const key of config.personKeys) {
    const value = raw?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return String(typeof value === "object" ? value.id : value);
    }
  }

  const details = raw?.[config.detailKey];

  if (details?.id !== undefined && details?.id !== null) {
    return String(details.id);
  }

  return null;
};

const getStageAssignments = (raw, currentStaff) => {
  const allAssignedStages = STAGE_CONFIG.map((config) => {
    const personId = getStagePersonId(raw, config);
    const details = raw?.[config.detailKey] ?? null;
    const rawStatus = raw?.[config.statusKey];

    return {
      key: config.key,
      label: config.label,
      icon: config.icon,
      personId,
      staffName: details?.username ?? details?.name ?? "",
      rawStatus,
      status: normalizeStageStatus(rawStatus),
    };
  }).filter((stage) => stage.personId !== null);

  // If we know the logged-in staff ID, show only their stages.
  if (currentStaff?.id) {
    const matchingStages = allAssignedStages.filter(
      (stage) => stage.personId === String(currentStaff.id),
    );

    if (matchingStages.length > 0) {
      return matchingStages;
    }
  }

  // The assignedWork endpoint may already filter by the logged-in staff.
  // If the stored user ID is missing or doesn't match, preserve the API's
  // non-empty stage assignments instead of hiding every stage.
  return allAssignedStages;
};

// =========================================================
// PROJECT / CUSTOMER FIELDS
// =========================================================

const getProjectName = (raw) => {
  const value = getNested(
    raw,
    [
      "order_details.project_name",
      "order_details.projectName",
      "order_details.order_name",
      "order_details.project_title",
      "order_details.title",
      "order_details.name",
      "project_name",
      "projectName",
      "order_name",
      "project_title",
      "title",
    ],
    "",
  );

  if (typeof value === "object") {
    const name = value.project_name ?? value.name ?? value.title;
    if (name) return String(name);
  } else if (value) {
    return String(value);
  }

  const slipNo = raw?.order_details?.slip_no;

  return slipNo !== undefined && slipNo !== null
    ? `Project · ${slipNo}`
    : "Untitled project";
};

const getCustomerName = (raw) => {
  const value = getNested(
    raw,
    [
      "order_details.customer_details.name",
      "order_details.customer_details.customer_name",
      "order_details.customer_details.company_name",
      "order_details.customer_details.company",
      "customer_details.name",
      "customer_details.customer_name",
      "customer_details.company_name",
      "order_details.customer_name",
      "customer_name",
      "customer",
    ],
    "",
  );

  return asDisplayName(value) || "Customer";
};

const getEstimateId = (raw) => {
  const value = getNested(
    raw,
    [
      "order_details.estimate_number",
      "order_details.estimate_no",
      "order_details.slip_no",
      "estimate_number",
      "estimate_no",
      "slip_no",
    ],
    "",
  );

  if (value === "") return "No estimate number";

  const stringValue = String(value);

  return stringValue.startsWith("EST-") ? stringValue : `EST-${stringValue}`;
};

const getDueDate = (raw) =>
  getNested(
    raw,
    [
      "order_details.delivery_date",
      "order_details.due_date",
      "order_details.expected_delivery_date",
      "delivery_date",
      "due_date",
      "dueDate",
    ],
    "",
  );

const getPriority = (raw) => {
  const value = getNested(
    raw,
    ["order_details.priority", "priority"],
    "Medium",
  );

  const normalized = String(value).trim().toLowerCase();

  if (normalized === "urgent") return "Urgent";
  if (normalized === "high") return "High";
  if (normalized === "low") return "Low";

  return "Medium";
};

// =========================================================
// NORMALIZE API ITEM
// =========================================================

const normalizeTask = (item, currentStaff) => {
  const raw = item?.raw ?? item;
  const orderDetails = raw?.order_details ?? {};

  const stages = getStageAssignments(raw, currentStaff);

  return {
    id: raw?.id ?? raw?.uuid ?? item?.id,
    projectId:
      typeof raw?.order === "string" || typeof raw?.order === "number"
        ? String(raw.order)
        : String(raw?.order?.id ?? orderDetails?.id ?? raw?.projectId ?? ""),

    projectName: getProjectName(raw),
    customer: getCustomerName(raw),
    estimateId: getEstimateId(raw),

    task:
      raw?.item_description ??
      raw?.task ??
      raw?.description ??
      "Production item",

    workType:
      raw?.work_type ?? raw?.workType ?? raw?.item_description ?? "Production",

    quantity: Number(raw?.quantity ?? raw?.qty ?? 0),
    dueDate: getDueDate(raw),
    priority: getPriority(raw),

    // Only the stage assignments relevant to this staff member are displayed.
    stages,

    // Preserve the original object for navigation/debugging.
    raw,
  };
};

// =========================================================
// DATE HELPERS
// =========================================================

const getToday = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const getDateKey = (value) => {
  if (!value || typeof value !== "string") return "";

  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);

  return match ? match[1] : "";
};

const formatDate = (date) => {
  const value = getDateKey(date);
  if (!value) return "Not set";

  const [year, month, day] = value.split("-");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${day} ${months[Number(month) - 1] ?? ""} ${year}`;
};

// =========================================================
// STAGE COUNTS
// =========================================================

const getStageCounts = (tasks) => {
  const counts = {
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
    Unknown: 0,
    total: 0,
  };

  tasks.forEach((task) => {
    task.stages.forEach((stage) => {
      counts.total += 1;
      counts[stage.status] = (counts[stage.status] ?? 0) + 1;
    });
  });

  return counts;
};

const getOverallTaskStatus = (task) => {
  if (!task.stages.length) return "Unassigned";

  const statuses = task.stages.map((stage) => stage.status);

  if (statuses.includes("In Progress")) return "In Progress";
  if (statuses.includes("Pending")) return "Pending";

  if (statuses.every((status) => status === "Completed")) {
    return "Completed";
  }

  return "Unknown";
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const StaffTasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("All");

  const today = getToday();

  useEffect(() => {
    let active = true;

    const loadTasks = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const response = await assignedWork();
        const rawTasks = getArrayFromResponse(response);
        const currentStaff = getCurrentStaff();

        console.log("[StaffTasks] Logged-in staff:", currentStaff);
        console.log("[StaffTasks] Raw API items:", rawTasks);

        const normalized = rawTasks.map((item) =>
          normalizeTask(item, currentStaff),
        );

        console.table(
          normalized.map((task) => ({
            project: task.projectName,
            customer: task.customer,
            assignmentId: task.id,
            stages: task.stages.map((stage) => stage.label).join(", "),
            stageStatuses: task.stages
              .map((stage) => `${stage.label}: ${stage.status}`)
              .join(" | "),
          })),
        );

        if (active) setTasks(normalized);
      } catch (error) {
        console.error("[StaffTasks] Load failed:", error);

        if (active) {
          setLoadError(
            error?.response?.data?.detail ??
              error?.response?.data?.message ??
              error?.message ??
              "Unable to load your assigned work.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  const todayTasks = useMemo(
    () => tasks.filter((task) => getDateKey(task.dueDate) === today),
    [tasks, today],
  );

  const counts = useMemo(() => getStageCounts(tasks), [tasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const searchText = [
        task.projectName,
        task.customer,
        task.estimateId,
        task.task,
        task.workType,
        task.projectId,
        ...task.stages.map((stage) => stage.label),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(query);

      const overallStatus = getOverallTaskStatus(task);

      const matchesStatus =
        filter === "All" ||
        task.stages.some((stage) => stage.status === filter) ||
        overallStatus === filter;

      const matchesView =
        view === "All" ||
        (view === "Today" && getDateKey(task.dueDate) === today) ||
        (view === "Upcoming" &&
          getDateKey(task.dueDate) !== "" &&
          getDateKey(task.dueDate) > today) ||
        (view === "No due date" && !getDateKey(task.dueDate));

      return matchesSearch && matchesStatus && matchesView;
    });
  }, [tasks, search, filter, view, today]);

  const openTaskDetails = (task) => {
    if (!task.id) {
      console.error("[StaffTasks] Assignment ID is missing:", task);
      return;
    }

    navigate(`/staff/tasks/${task.id}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* PAGE HEADER */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <FiPackage size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  My Production Work
                </h1>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  Projects and production stages assigned to you.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 sm:self-auto dark:border-slate-800 dark:bg-slate-900">
            <FiCalendar className="text-orange-500" size={17} />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Today
              </p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {formatDate(today)}
              </p>
            </div>
          </div>
        </header>

        {/* STAGE SUMMARY */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              Stage overview
            </h2>
            <span className="text-xs text-slate-400">
              {loading ? "Loading..." : `${counts.total} assigned stages`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard
              label="Pending"
              value={loading ? "—" : counts.Pending}
              description="Waiting to start"
              tone="amber"
            />
            <SummaryCard
              label="In Progress"
              value={loading ? "—" : counts["In Progress"]}
              description="Currently working"
              tone="orange"
            />
            <SummaryCard
              label="Completed"
              value={loading ? "—" : counts.Completed}
              description="Stage finished"
              tone="green"
            />
            <SummaryCard
              label="Projects"
              value={loading ? "—" : tasks.length}
              description="Assigned work items"
              tone="slate"
            />
          </div>
        </section>

        {/* FILTERS */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <FiSearch
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search project, customer, or stage..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-950 dark:focus:ring-orange-500/10"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative sm:w-44">
                <FiCalendar
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={view}
                  onChange={(event) => setView(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="All">All dates</option>
                  <option value="Today">Due today</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="No due date">No due date</option>
                </select>
              </div>

              <div className="relative sm:w-44">
                <FiFilter
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="All">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              {loading
                ? "Loading assignments..."
                : `${filteredTasks.length} of ${tasks.length} work items`}
            </p>

            {(search || filter !== "All" || view !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                  setView("All");
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                <FiX size={13} /> Clear filters
              </button>
            )}
          </div>
        </section>

        {/* TASKS */}
        <section>
          {loading ? (
            <LoadingState />
          ) : loadError ? (
            <ErrorState message={loadError} />
          ) : filteredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <ProjectTaskCard
                  key={task.id}
                  task={task}
                  onOpen={() => openTaskDetails(task)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// =========================================================
// PROJECT CARD
// =========================================================

const ProjectTaskCard = ({ task, onOpen }) => {
  const overallStatus = getOverallTaskStatus(task);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-orange-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/30">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <FiPackage size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                  {task.estimateId}
                </span>
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={overallStatus} />
              </div>

              <h3 className="mt-2 truncate text-base font-bold text-slate-900 dark:text-white">
                {task.projectName}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {task.task}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <FiUser size={13} />
                  {task.customer}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                </span>
                <span>{task.quantity} pcs</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
          >
            View task <FiChevronRight size={15} />
          </button>
        </div>

        {/* INDIVIDUAL STAGE STATUS */}
        <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Your assigned stages
            </h4>
            <span className="text-[10px] text-slate-400">
              {task.stages.length}{" "}
              {task.stages.length === 1 ? "stage" : "stages"}
            </span>
          </div>

          {task.stages.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-xs text-slate-500 dark:bg-slate-950">
              No matching stage assignment was found in this API item.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {task.stages.map((stage) => (
                <StageRow key={stage.key} stage={stage} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

// =========================================================
// STAGE ROW
// =========================================================

const StageRow = ({ stage }) => {
  const Icon = stage.icon;

  const tones = {
    Pending: {
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      border: "border-amber-200/80 dark:border-amber-500/20",
    },
    "In Progress": {
      icon: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
      border: "border-orange-200/80 dark:border-orange-500/20",
    },
    Completed: {
      icon: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
      border: "border-green-200/80 dark:border-green-500/20",
    },
    Unknown: {
      icon: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
      border: "border-slate-200 dark:border-slate-700",
    },
  };

  const tone = tones[stage.status] ?? tones.Unknown;

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-xl border ${tone.border} px-3 py-3`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
          {stage.label}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {stage.staffName || "Assigned to you"}
        </p>
      </div>

      <StatusBadge status={stage.status} />
    </div>
  );
};

// =========================================================
// SUMMARY CARD
// =========================================================

const SummaryCard = ({ label, value, description, tone }) => {
  const styles = {
    amber: {
      bar: "bg-amber-500",
      number: "text-amber-600 dark:text-amber-400",
    },
    orange: {
      bar: "bg-orange-500",
      number: "text-orange-600 dark:text-orange-400",
    },
    green: {
      bar: "bg-green-500",
      number: "text-green-600 dark:text-green-400",
    },
    slate: {
      bar: "bg-slate-400",
      number: "text-slate-800 dark:text-white",
    },
  };

  const style = styles[tone] ?? styles.slate;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className={`absolute inset-x-0 top-0 h-1 ${style.bar}`} />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${style.number}`}>{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">{description}</p>
    </div>
  );
};

// =========================================================
// BADGES
// =========================================================

const StatusBadge = ({ status }) => {
  const styles = {
    Pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    "In Progress":
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    Completed:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
    Unknown:
      "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
    Unassigned:
      "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  const style = styles[status] ?? styles.Unknown;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${style}`}
    >
      {status === "Completed" && <FiCheck size={11} />}
      {status === "In Progress" && (
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      )}
      {status === "Pending" && <FiClock size={10} />}
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    Urgent:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    High: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    Medium:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    Low: "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[priority] ?? styles.Medium}`}
    >
      {priority}
    </span>
  );
};

// =========================================================
// STATES
// =========================================================

const LoadingState = () => (
  <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />
    <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
      Loading your production work
    </p>
    <p className="mt-1 text-xs text-slate-400">
      Fetching project and stage assignments...
    </p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-500/20 dark:bg-red-500/10">
    <p className="text-sm font-bold text-red-700 dark:text-red-400">
      Could not load assigned work
    </p>
    <p className="mt-1 text-sm text-red-600 dark:text-red-300">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">
      <FiSearch size={20} />
    </div>
    <h3 className="mt-4 text-sm font-bold text-slate-800 dark:text-white">
      No matching work items
    </h3>
    <p className="mt-1 text-xs text-slate-400">
      Try changing the search text or filters.
    </p>
  </div>
);

export default StaffTasks;
