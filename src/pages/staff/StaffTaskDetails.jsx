import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiHash,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiPlay,
  FiUser,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { assignedWork, createAssignedWork } from "../../api/staffWork";
import { getProjects } from "../../api/project";
import Production from "../../components/ProductionWorkflow";
import { toast } from "react-hot-toast";

// =========================================================
// CONSTANTS
// =========================================================

const STAGES = [
  {
    key: "designing",
    label: "Designing",
    personField: "Designing_person",
    detailsField: "designing_person_details",
    statusField: "designing_status",
  },
  {
    key: "printing",
    label: "Printing",
    personField: "printing_person",
    detailsField: "printing_person_details",
    statusField: "printing_status",
  },
  {
    key: "binding",
    label: "Binding",
    personField: "binding_person",
    detailsField: "binding_person_details",
    statusField: "binding_status",
  },
];

// =========================================================
// HELPERS
// =========================================================

const normalizeStatus = (value) => {
  const status = String(value || "waiting")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");

  if (
    ["completed", "complete", "done", "finished", "printed"].includes(status)
  ) {
    return "Completed";
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

  return "Pending";
};

const getPriority = (priority) => {
  const value = String(priority || "Normal").toLowerCase();

  if (value === "urgent") return "Urgent";
  if (value === "high") return "High";
  if (value === "low") return "Low";

  return "Medium";
};

const getArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.orders)) return response.data.orders;
  if (Array.isArray(response?.orders)) return response.orders;

  return [];
};

const getLoggedInUser = () => {
  const keys = ["user", "currentUser", "authUser", "userData", "staff"];

  for (const key of keys) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "null");

      if (parsed && typeof parsed === "object") {
        const user = parsed.user || parsed.staff || parsed.data || parsed;

        if (user.id != null || user.pk != null || user.username || user.email) {
          return {
            ...user,
            id: user.id ?? user.pk ?? user.user_id,
            username: user.username ?? user.user_name ?? user.name,
            role: user.role ?? parsed.role ?? localStorage.getItem("role"),
          };
        }
      }
    } catch {
      // Try the next localStorage key.
    }
  }

  return {
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  };
};

const getDisplayName = (person) => {
  if (!person) return "";

  if (typeof person === "string" || typeof person === "number") {
    return String(person);
  }

  return (
    person.username || person.name || person.full_name || person.email || ""
  );
};

const getCustomerDetails = (order) => {
  const customer =
    order?.customer_details ||
    order?.customer_info ||
    order?.customer_data ||
    {};

  return {
    name:
      getDisplayName(customer) ||
      order?.customer_name ||
      order?.customerName ||
      (typeof order?.customer === "object"
        ? getDisplayName(order.customer)
        : "") ||
      "Customer not available",

    phone:
      customer.contact_no ||
      customer.phone ||
      customer.phone_number ||
      customer.mobile ||
      order?.customer_phone ||
      "Not provided",

    address:
      customer.address ||
      customer.location ||
      order?.customer_address ||
      "Not provided",
  };
};

const getEstimateId = (order) => {
  const slipNumber = order?.slip_no ?? order?.slip_number;

  if (slipNumber == null || slipNumber === "") return "—";

  const value = String(slipNumber);
  return /^EST-/i.test(value) ? value : `EST-${value}`;
};

const getAssignedStages = (item, user) => {
  const userId = user?.id;
  const username = String(user?.username || "").toLowerCase();

  const hasIdentity = userId != null || Boolean(username);

  return STAGES.filter((stage) => {
    const person = item?.[stage.personField];
    const details = item?.[stage.detailsField];

    if (userId != null) {
      if (person != null) {
        return String(person) === String(userId);
      }

      if (details?.id != null) {
        return String(details.id) === String(userId);
      }

      return false;
    }

    if (username) {
      const assignedUsername = String(details?.username || "").toLowerCase();

      if (assignedUsername) {
        return assignedUsername === username;
      }

      return false;
    }

    // Fallback for installations where the API already scopes assignedWork
    // to the logged-in staff member and the user object has no ID/username.
    return !hasIdentity && person != null;
  });
};
const mapTask = (item, user) => {
  const order = item?.order_details || {};

  // CustomerSerializer returns these exact fields.
  const customerDetails = order?.customer_details || {};
  const customer = {
    name: customerDetails.name || "Unknown Customer",
    phone: customerDetails.contact_no || "",
    address: customerDetails.address || "",
  };

  // These are the three status fields defined in SlipItem.
  const stageDefinitions = [
    {
      name: "Designing",
      personField: "Designing_person",
      detailsField: "designing_person_details",
      statusField: "designing_status",
    },
    {
      name: "Printing",
      personField: "printing_person",
      detailsField: "printing_person_details",
      statusField: "printing_status",
    },
    {
      name: "Binding",
      personField: "binding_person",
      detailsField: "binding_person_details",
      statusField: "binding_status",
    },
  ];

  const normalizeStageStatus = (value) => {
    const status = String(value || "waiting")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");

    if (["completed", "complete", "finished", "done"].includes(status)) {
      return "Completed";
    }

    if (
      ["in_progress", "started", "processing", "working", "ongoing"].includes(
        status,
      )
    ) {
      return "In Progress";
    }

    // Django's current model uses "waiting".
    // "wating" is supported for older records.
    return "Pending";
  };

  const getDisplayNameSafe = (person) => {
    if (!person) return "";

    if (typeof person === "object") {
      return person.username || person.name || person.full_name || "";
    }

    return String(person);
  };

  // Filter stages assigned to the current staff member.
  // If no user identity is available, retain non-empty assignments
  // because the staff endpoint may already be filtered by the backend.
  const userId = user?.id != null ? String(user.id) : "";
  const username = String(user?.username || "").toLowerCase();

  const assignedStages = stageDefinitions
    .filter((stage) => {
      const assignedId = item?.[stage.personField];
      const assignedPerson = item?.[stage.detailsField];

      if (assignedId == null && !assignedPerson) {
        return false;
      }

      if (!userId && !username) {
        return assignedId != null || Boolean(assignedPerson);
      }

      if (userId) {
        return assignedId != null && String(assignedId) === userId;
      }

      return String(assignedPerson?.username || "").toLowerCase() === username;
    })
    .map((stage) => ({
      name: stage.name,
      personField: stage.personField,
      detailsField: stage.detailsField,
      statusField: stage.statusField,
      status: normalizeStageStatus(item?.[stage.statusField]),
      assignedPerson: getDisplayNameSafe(item?.[stage.detailsField]),
    }));

  const completedStages = assignedStages.filter(
    (stage) => stage.status === "Completed",
  ).length;

  const inProgressStages = assignedStages.filter(
    (stage) => stage.status === "In Progress",
  ).length;

  const totalStages = assignedStages.length;

  const progress =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  let overallStatus = "Pending";

  if (totalStages > 0 && completedStages === totalStages) {
    overallStatus = "Completed";
  } else if (inProgressStages > 0 || completedStages > 0) {
    overallStatus = "In Progress";
  }

  const slipNumber = order?.slip_no;

  return {
    id: String(item?.id ?? ""),
    rawId: item?.id,
    orderId: item?.order ?? order?.id ?? "",

    // slip_no is numeric in Django.
    estimateId: slipNumber != null ? `EST-${slipNumber}` : "",

    projectName:
      order?.project_name ||
      (slipNumber != null
        ? `Project ${slipNumber}`
        : item?.item_description || "Untitled Project"),

    customer: customer.name,
    customerPhone: customer.phone,
    customerAddress: customer.address,

    dueDate: order?.delivery_date || "",

    priority: getPriority(order?.priority || "normal"),

    stages: assignedStages,
    totalStages,
    completedStages,
    progress,
    status: overallStatus,

    // These fields are available only if the serializer includes them.
    quantity: item?.quantity ?? "—",
    rate: item?.rate ?? "—",
    subtotal: item?.subtotal ?? "—",
    paper: item?.paper_type || "Not specified",
    size: item?.size || "Not specified",
    ink: order?.maso || "Not specified",
    printing: item?.work_type || "Not specified",
    finishing: item?.maso || "Not specified",
    bandType: item?.band_type || "Not specified",

    notes:
      item?.description ||
      item?.item_description ||
      order?.description ||
      "No production notes available.",

    itemDescription: item?.item_description || item?.description || "",

    itemName: item?.item_description || item?.description || "Production item",
    assignedTo:
      user?.username ||
      assignedStages
        .map((stage) => stage.assignedPerson)
        .filter(Boolean)
        .join(", ") ||
      "Assigned staff",

    raw: item,
  };
};

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

// =========================================================
// MAIN COMPONENT
// =========================================================

const StaffTaskDetails = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStage, setUpdatingStage] = useState("");
  const [loadError, setLoadError] = useState("");

  const user = useMemo(() => getLoggedInUser(), []);
  const loadTasks = useCallback(async () => {
    console.group("🔄 STAFF TASK DETAILS: FETCH START");

    try {
      setLoading(true);
      setLoadError("");

      console.log("👤 Logged-in user:", user);
      console.log("🆔 Route task ID:", taskId);

      // Fetch assigned items and orders together.
      const results = await Promise.allSettled([assignedWork(), getProjects()]);

      // ------------------------------------------
      // 1. STAFF WORK RESPONSE
      // ------------------------------------------

      let workRecords = [];

      if (results[0].status === "fulfilled") {
        const response = results[0].value;

        console.group("📦 ASSIGNED WORK API");
        console.log("Full response:", response);
        console.log("Response data:", response?.data);
        console.log("Response keys:", Object.keys(response?.data || {}));

        workRecords = getArray(response);

        console.log("Extracted work records:", workRecords);
        console.log("Number of work records:", workRecords.length);

        if (workRecords.length > 0) {
          console.log("First raw work item:", workRecords[0]);
          console.log(
            "First work item's fields:",
            Object.keys(workRecords[0] || {}),
          );
          console.log(
            "First work item's item_description:",
            workRecords[0]?.item_description,
          );
          console.log(
            "First work item's order_details:",
            workRecords[0]?.order_details,
          );
        } else {
          console.warn("⚠️ No work records found in the response.");
        }

        console.groupEnd();
      } else {
        console.error("❌ Assigned work API failed:", results[0].reason);
      }

      // ------------------------------------------
      // 2. PROJECT / ORDER RESPONSE
      // ------------------------------------------

      let projectRecords = [];

      if (results[1].status === "fulfilled") {
        const response = results[1].value;

        console.group("📋 PROJECTS API");
        console.log("Full response:", response);
        console.log("Response data:", response?.data);
        console.log("Response keys:", Object.keys(response?.data || {}));

        projectRecords = getArray(response);

        console.log("Extracted projects:", projectRecords);
        console.log("Number of projects:", projectRecords.length);

        if (projectRecords.length > 0) {
          console.log("First project:", projectRecords[0]);
          console.log(
            "First project's fields:",
            Object.keys(projectRecords[0] || {}),
          );
        } else {
          console.warn("⚠️ No projects extracted from the response.");
        }

        console.groupEnd();
      } else {
        console.error("❌ Projects API failed:", results[1].reason);
      }

      // ------------------------------------------
      // 3. INDEX PROJECTS BY ORDER ID
      // ------------------------------------------

      const projectById = new Map();

      projectRecords.forEach((project) => {
        const id = project?.id;

        if (id != null) {
          projectById.set(String(id).toLowerCase(), project);
        }
      });

      // ------------------------------------------
      // 4. ENRICH EACH WORK ITEM
      // ------------------------------------------

      const enrichedRecords = workRecords.map((item) => {
        const orderId = item?.order ?? item?.order_details?.id;

        const project =
          orderId != null
            ? projectById.get(String(orderId).toLowerCase())
            : null;

        const nestedOrder = item?.order_details || {};

        // Preserve nested API values, but fill missing values
        // using the matching project/order record.
        const mergedOrder = {
          ...(project || {}),
          ...nestedOrder,
        };

        [
          "project_name",
          "slip_no",
          "customer_details",
          "delivery_date",
          "priority",
          "description",
          "print_details_full",
        ].forEach((field) => {
          const currentValue = mergedOrder[field];

          if (
            currentValue == null ||
            currentValue === "" ||
            (field === "customer_details" &&
              Object.keys(currentValue || {}).length === 0)
          ) {
            if (project?.[field] != null) {
              mergedOrder[field] = project[field];
            }
          }
        });

        const enrichedItem = {
          ...item,
          order_details: mergedOrder,
        };

        console.groupCollapsed(
          `🧾 Work item: ${item?.item_description || item?.id || "Unknown"}`,
        );
        console.log("Item ID:", item?.id);
        console.log("Order ID:", orderId);
        console.log("Matched project:", project || "No matching project");
        console.log("Raw item description:", item?.item_description);
        console.log("Raw nested order:", nestedOrder);
        console.log("Merged order details:", mergedOrder);
        console.log("Final enriched item:", enrichedItem);
        console.groupEnd();

        return enrichedItem;
      });

      // ------------------------------------------
      // 5. MAP TO FRONTEND TASK FORMAT
      // ------------------------------------------

      const mapped = enrichedRecords
        .filter((item) => item && item.id != null)
        .map((item) => mapTask(item, user));

      console.group("✅ MAPPED STAFF TASKS");
      console.log("Mapped tasks:", mapped);

      mapped.forEach((task) => {
        console.log("Task summary:", {
          id: task.id,
          orderId: task.orderId,
          estimateId: task.estimateId,
          projectName: task.projectName,
          itemName: task.itemName,
          itemDescription: task.itemDescription,
          notes: task.notes,
          customer: task.customer,
          stages: task.stages,
        });
      });

      console.groupEnd();

      setTaskList(mapped);

      if (results[0].status === "rejected") {
        throw results[0].reason;
      }
    } catch (error) {
      console.error("❌ FAILED TO LOAD STAFF TASKS", {
        message: error?.message,
        status: error?.response?.status,
        responseData: error?.response?.data,
        url: error?.config?.url,
        method: error?.config?.method,
        error,
      });

      setLoadError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Unable to load your assigned work. Please try again.",
      );
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  }, [user, taskId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const task = taskList.find(
    (item) => item.id.toLowerCase() === String(taskId || "").toLowerCase(),
  );

  // Update only the stage selected by the staff member.
  const updateStageStatus = async (stage, nextStatus) => {
    if (!task || updatingStage || !stage) return;

    // Match the values expected by the Django API.
    const apiStatus =
      nextStatus === "In Progress"
        ? "in_progress"
        : nextStatus === "Completed"
          ? "completed"
          : "waiting";

    try {
      setUpdatingStage(stage.key);

      await createAssignedWork(task.rawId, stage.statusField, apiStatus);

      toast.success(`${stage.label} marked ${nextStatus.toLowerCase()}.`);

      await loadTasks();
    } catch (error) {
      console.error("Stage status update failed:", {
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.url,
        body: error?.config?.data,
      });

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          `Could not update ${stage.label.toLowerCase()}. Check the API endpoint and Django logs.`,
      );
    } finally {
      setUpdatingStage("");
    }
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl py-24 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading your assigned work...
          </p>
        </div>
      </PageShell>
    );
  }

  // =======================================================
  // NOT FOUND
  // =======================================================

  if (!task) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl">
          <BackButton onClick={() => navigate("/staff/tasks")} />

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              {loadError ? (
                <FiAlertCircle size={24} />
              ) : (
                <FiFileText size={24} />
              )}
            </div>

            <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {loadError ? "Unable to load work" : "Assigned work not found"}
            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              {loadError ||
                "This work item could not be found in your assigned-work list. Check that the URL contains the production item ID returned by the API."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {loadError && (
                <button
                  type="button"
                  onClick={loadTasks}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <FiRefreshCw size={15} />
                  Try Again
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate("/staff/tasks")}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Back to My Work
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  const isCompleted = task.status === "Completed";
  const isInProgress = task.status === "In Progress";

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl">
        <BackButton onClick={() => navigate("/staff/tasks")} />

        {/* HEADER */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    <FiHash size={12} />
                    {task.estimateId}
                  </span>

                  <StatusBadge status={task.status} />

                  <PriorityBadge priority={task.priority} />
                </div>

                <h1 className="mt-4 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {task.projectName}
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {task.itemName}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500 dark:text-slate-400">
                  <MetaItem icon={FiUser} value={task.customer} />
                  <MetaItem
                    icon={FiPackage}
                    value={`${task.totalStages} assigned stage${task.totalStages === 1 ? "" : "s"}`}
                  />
                  <MetaItem
                    icon={FiCalendar}
                    value={`Due ${formatDate(task.dueDate)}`}
                  />
                </div>
              </div>

              <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assigned stage progress
                </p>
                <p className="mt-1 text-2xl font-bold text-orange-500">
                  {task.progress}%
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {task.completedStages} of {task.totalStages} completed
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800 sm:px-7">
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? "bg-green-500" : "bg-orange-500"
                }`}
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {isCompleted
                  ? "All your assigned stages are completed"
                  : isInProgress
                    ? "Your assigned production work is underway"
                    : "Your assigned work is waiting to start"}
              </span>
              <span className="shrink-0 font-semibold">
                {task.totalStages} stage{task.totalStages === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        </section>

        {/* ASSIGNED STAGES */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                My Assigned Stages
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Each production stage has its own status and controls.
              </p>
            </div>

            <button
              type="button"
              onClick={loadTasks}
              disabled={loading || Boolean(updatingStage)}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <FiRefreshCw size={13} />
              Refresh
            </button>
          </div>

          {task.stages.length === 0 ? (
            <div className="p-8 text-center">
              <FiAlertCircle className="mx-auto text-2xl text-amber-500" />
              <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-white">
                No matching assigned stages found
              </p>
              <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500 dark:text-slate-400">
                Verify the logged-in user's ID and the person IDs returned by
                the API. This page only displays stages assigned to the current
                staff member.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {task.stages.map((stage, index) => (
                <StageRow
                  key={stage.key}
                  stage={stage}
                  index={index}
                  updating={updatingStage === stage.key}
                  anyUpdating={Boolean(updatingStage)}
                  onStart={() => updateStageStatus(stage, "In Progress")}
                  onComplete={() => updateStageStatus(stage, "Completed")}
                  onReopen={() => updateStageStatus(stage, "In Progress")}
                />
              ))}
            </div>
          )}
        </section>

        {/* MAIN CONTENT */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-6">
            {/* PRODUCTION WORKFLOW */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Production Workflow
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Full production workflow for this item
                </p>
              </div>

              <div className="p-3 sm:p-5">
                <Production taskId={task.rawId} />
              </div>
            </section>

            {/* PRODUCTION NOTES AND ITEM DESCRIPTION */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <SectionHeading
                icon={FiFileText}
                title="Production Notes"
                description="Instructions and item details"
              />

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Item Description
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {task.itemDescription ||
                      task.raw?.item_description ||
                      "No item description available."}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Production Instructions
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {task.notes || "No production notes available."}
                  </p>
                </div>
              </div>
            </section>

            {/* ITEM SPECIFICATIONS */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <SectionHeading
                icon={FiPackage}
                title="Item Specifications"
                description="Available production details from the order"
              />

              <div className="grid gap-px bg-slate-100 dark:bg-slate-800 sm:grid-cols-2">
                <SpecItem label="Quantity" value={task.quantity} />
                <SpecItem label="Paper Type" value={task.paper} />
                <SpecItem label="Size" value={task.size} />
                <SpecItem label="Work Type" value={task.printing} />
                <SpecItem label="Finishing" value={task.finishing} />
                <SpecItem label="Ink / Print Details" value={task.ink} />
              </div>
            </section>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-6">
            {/* CUSTOMER */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <SectionHeading
                icon={FiUser}
                title="Customer"
                description="Order contact information"
              />

              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    {task.customer?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {task.customer}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Customer
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <ContactLine
                    icon={FiPhone}
                    label="Phone"
                    value={task.customerPhone}
                  />
                  <ContactLine
                    icon={FiMapPin}
                    label="Address"
                    value={task.customerAddress}
                  />
                </div>
              </div>
            </section>

            {/* TASK INFORMATION */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <SectionHeading
                icon={FiFileText}
                title="Task Information"
                description="Order and assignment reference"
              />

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <SideInfo label="Work Item ID" value={task.id} />
                <SideInfo label="Order ID" value={task.orderId} />
                <SideInfo label="Estimate" value={task.estimateId} />
                <SideInfo label="Assigned Staff" value={task.assignedTo} />
                <SideInfo label="Due Date" value={formatDate(task.dueDate)} />
                <SideInfo label="Priority" value={task.priority} />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PageShell>
  );
};

// =========================================================
// PAGE SHELL
// =========================================================

const PageShell = ({ children }) => (
  <div className="min-h-screen bg-[#f7f8fa] p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
    {children}
  </div>
);

const BackButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400"
  >
    <FiArrowLeft size={16} />
    Back to My Work
  </button>
);

// =========================================================
// STAGE ROW
// =========================================================

const StageRow = ({
  stage,
  index,
  updating,
  anyUpdating,
  onStart,
  onComplete,
  onReopen,
}) => {
  const completed = stage.status === "Completed";
  const inProgress = stage.status === "In Progress";

  return (
    <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            completed
              ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
              : inProgress
                ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {completed ? (
            <FiCheckCircle size={19} />
          ) : inProgress ? (
            <FiPlay size={18} />
          ) : (
            <FiClock size={19} />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {stage.label}
            </h3>
            <StatusBadge status={stage.status} />
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Assigned production stage #{index + 1}
          </p>

          {stage.assignedPerson && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <FiUser size={12} />
              {stage.assignedPerson}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
        {stage.status === "Pending" && (
          <button
            type="button"
            onClick={onStart}
            disabled={anyUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiPlay size={13} />
            {updating ? "Updating..." : "Start Stage"}
          </button>
        )}

        {inProgress && (
          <button
            type="button"
            onClick={onComplete}
            disabled={anyUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiCheck size={14} />
            {updating ? "Updating..." : "Mark Completed"}
          </button>
        )}

        {completed && (
          <button
            type="button"
            onClick={onReopen}
            disabled={anyUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-orange-500/50 dark:hover:text-orange-400"
          >
            <FiRefreshCw size={13} />
            {updating ? "Updating..." : "Reopen Stage"}
          </button>
        )}
      </div>
    </div>
  );
};

// =========================================================
// REUSABLE COMPONENTS
// =========================================================

const SectionHeading = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  </div>
);

const MetaItem = ({ icon: Icon, value }) => (
  <span className="inline-flex min-w-0 items-center gap-1.5">
    <Icon size={13} className="shrink-0" />
    <span className="break-words">{value}</span>
  </span>
);

const ContactLine = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <Icon size={15} className="mt-0.5 shrink-0 text-slate-400" />
    <div className="min-w-0">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-xs leading-5 text-slate-600 dark:text-slate-300">
        {value || "—"}
      </p>
    </div>
  </div>
);

const SideInfo = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 px-5 py-3.5">
    <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <span className="min-w-0 break-all text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
      {value || "—"}
    </span>
  </div>
);

const SpecItem = ({ label, value }) => (
  <div className="bg-white px-5 py-4 dark:bg-slate-900">
    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1.5 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
      {value || "—"}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    Pending:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    "In Progress":
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    Completed:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400",
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || styles.Pending
      }`}
    >
      {status === "Completed" && <FiCheck size={10} />}
      {status === "In Progress" && (
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
      )}
      {status === "Pending" && (
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      )}
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    Urgent:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",
    High: "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    Medium:
      "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    Low: "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
};

export default StaffTaskDetails;
