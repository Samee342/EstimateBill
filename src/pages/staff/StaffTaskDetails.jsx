import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiHash,
  FiChevronRight,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiPlay,
  FiTool,
  FiUser,
} from "react-icons/fi";

// =========================================================
// SAMPLE TASK DATA
// Later replace this with API data
// =========================================================

const tasks = [
  {
    id: "TASK-1001",
    projectId: "PRJ-1001",
    estimateId: "EST-10245",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    customerPhone: "9845123456",
    customerAddress: "Butwal, Rupandehi",
    task: "Design",
    workType: "Design",
    dueDate: "2026-09-18",
    priority: "High",
    status: "Completed",
    progress: 100,
    quantity: 500,

    paper: "300 GSM Art Card",
    size: "3.5 × 2 inch",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "None",

    notes:
      "Use the approved customer design. Make sure the logo and contact information are properly aligned.",

    assignedTo: "Aashish",
    startedAt: "2026-09-18T09:10:00",
    completedAt: "2026-09-18T10:42:00",
  },

  {
    id: "TASK-1002",
    projectId: "PRJ-1001",
    estimateId: "EST-10245",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    customerPhone: "9845123456",
    customerAddress: "Butwal, Rupandehi",
    task: "Printing",
    workType: "Offset Printing",
    dueDate: "2026-09-18",
    priority: "High",
    status: "In Progress",
    progress: 70,
    quantity: 500,

    paper: "300 GSM Art Card",
    size: "3.5 × 2 inch",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "None",

    notes:
      "Print according to the approved design. Check color alignment before completing the task.",

    assignedTo: "Aashish",
    startedAt: "2026-09-18T11:15:00",
    completedAt: null,
  },

  {
    id: "TASK-1003",
    projectId: "PRJ-1001",
    estimateId: "EST-10245",
    projectName: "Business Card Printing",
    customer: "Ram Sharma",
    customerPhone: "9845123456",
    customerAddress: "Butwal, Rupandehi",
    task: "Cutting",
    workType: "Finishing",
    dueDate: "2026-09-18",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    quantity: 500,

    paper: "300 GSM Art Card",
    size: "3.5 × 2 inch",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "Corner Cutting",

    notes:
      "Cut all cards accurately according to the approved size. Check the first batch before continuing.",

    assignedTo: "Aashish",
    startedAt: null,
    completedAt: null,
  },

  {
    id: "TASK-1004",
    projectId: "PRJ-1002",
    estimateId: "EST-10246",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    customerPhone: "9851234567",
    customerAddress: "Kohalpur, Banke",
    task: "Printing",
    workType: "Digital Printing",
    dueDate: "2026-09-18",
    priority: "Medium",
    status: "Pending",
    progress: 0,
    quantity: 300,

    paper: "250 GSM Matte",
    size: "5 × 7 inch",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "Lamination",

    notes: "Confirm invitation card colors before printing the full quantity.",

    assignedTo: "Bikash",
    startedAt: null,
    completedAt: null,
  },

  {
    id: "TASK-1005",
    projectId: "PRJ-1002",
    estimateId: "EST-10246",
    projectName: "Wedding Invitation Cards",
    customer: "Sita Karki",
    customerPhone: "9851234567",
    customerAddress: "Kohalpur, Banke",
    task: "Lamination",
    workType: "Lamination",
    dueDate: "2026-09-19",
    priority: "Low",
    status: "Pending",
    progress: 0,
    quantity: 300,

    paper: "250 GSM Matte",
    size: "5 × 7 inch",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "Matte Lamination",

    notes: "Apply matte lamination evenly without bubbles or scratches.",

    assignedTo: "Bikash",
    startedAt: null,
    completedAt: null,
  },

  {
    id: "TASK-1006",
    projectId: "PRJ-1003",
    estimateId: "EST-10247",
    projectName: "Restaurant Menu Printing",
    customer: "Hari Thapa",
    customerPhone: "9861234567",
    customerAddress: "Dhangadhi, Kailali",
    task: "Printing",
    workType: "Offset Printing",
    dueDate: "2026-09-18",
    priority: "Urgent",
    status: "In Progress",
    progress: 45,
    quantity: 1000,

    paper: "250 GSM Art Card",
    size: "A4",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "Lamination",

    notes:
      "Restaurant menu printing. Maintain consistent color across all batches.",

    assignedTo: "Bikash",
    startedAt: "2026-09-18T08:45:00",
    completedAt: null,
  },

  {
    id: "TASK-1007",
    projectId: "PRJ-1003",
    estimateId: "EST-10247",
    projectName: "Restaurant Menu Printing",
    customer: "Hari Thapa",
    customerPhone: "9861234567",
    customerAddress: "Dhangadhi, Kailali",
    task: "Binding",
    workType: "Finishing",
    dueDate: "2026-09-18",
    priority: "High",
    status: "Pending",
    progress: 0,
    quantity: 1000,

    paper: "250 GSM Art Card",
    size: "A4",
    ink: "Full Color",
    printing: "Front & Back",
    finishing: "Binding",

    notes: "Bind menus neatly after printing and lamination are completed.",

    assignedTo: "Bikash",
    startedAt: null,
    completedAt: null,
  },

  {
    id: "TASK-1008",
    projectId: "PRJ-1004",
    estimateId: "EST-10248",
    projectName: "Flex Banner Design",
    customer: "Aashish Gurung",
    customerPhone: "9801234567",
    customerAddress: "Pokhara, Kaski",
    task: "Printing",
    workType: "Flex Printing",
    dueDate: "2026-09-18",
    priority: "Urgent",
    status: "Completed",
    progress: 100,
    quantity: 20,

    paper: "Flex",
    size: "4 × 6 ft",
    ink: "Full Color",
    printing: "Single Side",
    finishing: "Eyelets",

    notes: "Check dimensions and customer branding before final printing.",

    assignedTo: "Aashish",
    startedAt: "2026-09-18T08:00:00",
    completedAt: "2026-09-18T09:25:00",
  },
];

// =========================================================
// MAIN COMPONENT
// =========================================================

const StaffTaskDetails = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const [taskList, setTaskList] = useState(tasks);

  const task = taskList.find(
    (item) => item.id.toLowerCase() === taskId?.toLowerCase(),
  );

  // =======================================================
  // ACTIONS
  // =======================================================

  const startTask = () => {
    if (!task) return;

    setTaskList((previousTasks) =>
      previousTasks.map((item) => {
        if (item.id !== task.id) {
          return item;
        }

        return {
          ...item,
          status: "In Progress",
          progress: item.progress === 0 ? 10 : item.progress,
          startedAt: item.startedAt || new Date().toISOString(),
        };
      }),
    );
  };

  const completeTask = () => {
    if (!task) return;

    setTaskList((previousTasks) =>
      previousTasks.map((item) => {
        if (item.id !== task.id) {
          return item;
        }

        return {
          ...item,
          status: "Completed",
          progress: 100,
          completedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const reopenTask = () => {
    if (!task) return;

    setTaskList((previousTasks) =>
      previousTasks.map((item) => {
        if (item.id !== task.id) {
          return item;
        }

        return {
          ...item,
          status: "In Progress",
          progress: item.progress === 100 ? 50 : item.progress,
          completedAt: null,
        };
      }),
    );
  };

  // =======================================================
  // NOT FOUND
  // =======================================================

  if (!task) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-5 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => navigate("/staff/tasks")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400"
          >
            <FiArrowLeft size={16} />
            Back to My Work
          </button>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <FiFileText size={22} />
            </div>

            <h1 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Task not found
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              The task you are looking for does not exist.
            </p>

            <button
              type="button"
              onClick={() => navigate("/staff/tasks")}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Back to My Work
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = task.status === "Completed";
  const isInProgress = task.status === "In Progress";

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="p-5 md:p-8">
        <div className="mx-auto max-w-6xl">
          {/* =================================================
              BACK
          ================================================== */}

          <button
            type="button"
            onClick={() => navigate("/staff/tasks")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400"
          >
            <FiArrowLeft size={16} />
            Back to My Work
          </button>

          {/* =================================================
              HEADER
          ================================================== */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="p-5 md:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-orange-500">
                      {task.id}
                    </span>

                    <StatusBadge status={task.status} />

                    <PriorityBadge priority={task.priority} />
                  </div>

                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {task.task}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {task.projectName}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FiHash size={13} />
                      {task.estimateId}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FiFileText size={13} />
                      {task.projectId}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FiUser size={13} />
                      {task.customer}
                    </span>
                  </div>
                </div>

                {/* ACTION */}

                <div className="shrink-0">
                  {task.status === "Pending" && (
                    <button
                      type="button"
                      onClick={startTask}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md sm:w-auto"
                    >
                      <FiPlay size={16} />
                      Start Work
                    </button>
                  )}

                  {task.status === "In Progress" && (
                    <button
                      type="button"
                      onClick={completeTask}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-600 hover:shadow-md sm:w-auto"
                    >
                      <FiCheck size={17} />
                      Mark Completed
                    </button>
                  )}

                  {task.status === "Completed" && (
                    <button
                      type="button"
                      onClick={reopenTask}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:border-orange-300 hover:text-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-orange-500/40 dark:hover:text-orange-400 sm:w-auto"
                    >
                      <FiPlay size={16} />
                      Reopen Task
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                PROGRESS
            ================================================== */}

            <div className="border-t border-slate-100 px-5 py-5 dark:border-slate-800 md:px-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Work Progress
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {isCompleted
                      ? "Production task completed"
                      : isInProgress
                        ? "Production work is currently in progress"
                        : "Task is waiting to be started"}
                  </p>
                </div>

                <span className="text-xl font-bold text-orange-500">
                  {task.progress}%
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? "bg-green-500" : "bg-orange-500"
                  }`}
                  style={{
                    width: `${task.progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              MAIN GRID
          ================================================== */}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* =================================================
                LEFT
            ================================================== */}

            <div className="space-y-6">
              {/* PRODUCTION DETAILS */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                      <FiTool size={17} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Production Details
                      </h2>

                      <p className="text-xs text-slate-400">
                        Specifications for this task
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
                  <DetailItem
                    icon={FiTool}
                    label="Work Type"
                    value={task.workType}
                  />

                  <DetailItem
                    icon={FiPackage}
                    label="Quantity"
                    value={`${task.quantity} pcs`}
                  />

                  <DetailItem
                    icon={FiFileText}
                    label="Paper"
                    value={task.paper}
                  />

                  <DetailItem icon={FiHash} label="Size" value={task.size} />

                  <DetailItem icon={FiPackage} label="Ink" value={task.ink} />

                  <DetailItem
                    icon={FiFileText}
                    label="Printing"
                    value={task.printing}
                  />

                  <DetailItem
                    icon={FiTool}
                    label="Finishing"
                    value={task.finishing}
                  />

                  <DetailItem
                    icon={FiCalendar}
                    label="Due Date"
                    value={formatDate(task.dueDate)}
                  />
                </div>
              </section>

              {/* NOTES */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                      <FiFileText size={17} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Production Notes
                      </h2>

                      <p className="text-xs text-slate-400">
                        Instructions for completing the work
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {task.notes}
                    </p>
                  </div>
                </div>
              </section>

              {/* ACTIVITY */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Task Activity
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Timeline of this production task
                  </p>
                </div>

                <div className="p-5">
                  <div className="relative space-y-6 pl-7">
                    <div className="absolute bottom-3 left-[9px] top-3 w-px bg-slate-200 dark:bg-slate-700" />

                    <TimelineItem
                      icon={FiFileText}
                      title="Task assigned"
                      description={`Assigned to ${task.assignedTo}`}
                      date={formatDate(task.dueDate)}
                    />

                    {task.startedAt && (
                      <TimelineItem
                        icon={FiPlay}
                        title="Work started"
                        description={`Started at ${formatTime(task.startedAt)}`}
                        date={formatDate(task.dueDate)}
                      />
                    )}

                    {task.completedAt && (
                      <TimelineItem
                        icon={FiCheckCircle}
                        title="Task completed"
                        description={`Completed at ${formatTime(
                          task.completedAt,
                        )}`}
                        date={formatDate(task.dueDate)}
                        completed
                      />
                    )}

                    {!task.completedAt && task.status !== "Pending" && (
                      <TimelineItem
                        icon={FiClock}
                        title="Currently in progress"
                        description="Production work has not been completed yet."
                        date="Current"
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================== */}

            <div className="space-y-6">
              {/* CUSTOMER */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Customer
                  </h2>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                      {task.customer.charAt(0)}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        {task.customer}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">Customer</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <FiPhone
                        size={15}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {task.customerPhone}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <FiMapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <p className="text-xs leading-5 text-slate-600 dark:text-slate-300">
                        {task.customerAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* TASK INFORMATION */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Task Information
                  </h2>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <SideInfo label="Task ID" value={task.id} />

                  <SideInfo label="Project ID" value={task.projectId} />

                  <SideInfo label="Estimate" value={task.estimateId} />

                  <SideInfo label="Assigned To" value={task.assignedTo} />

                  <SideInfo label="Due Date" value={formatDate(task.dueDate)} />
                </div>
              </section>

              {/* RELATED PROJECT */}

              <button
                type="button"
                onClick={() => {
                  // You can later change this to:
                  // navigate(`/staff/orders/${task.projectId}`);
                  console.log("Open project:", task.projectId);
                }}
                className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-orange-500/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    <FiFileText size={17} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Related Project</p>

                    <p className="mt-0.5 text-sm font-bold text-slate-800 group-hover:text-orange-500 dark:text-slate-200 dark:group-hover:text-orange-400">
                      {task.projectName}
                    </p>
                  </div>
                </div>

                <FiChevronRight
                  size={18}
                  className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-orange-500"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// DETAIL ITEM
// =========================================================

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
};

// =========================================================
// SIDE INFO
// =========================================================

const SideInfo = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <span className="text-xs text-slate-400">{label}</span>

      <span className="truncate text-right text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
};

// =========================================================
// TIMELINE ITEM
// =========================================================

const TimelineItem = ({
  icon: Icon,
  title,
  description,
  date,
  completed = false,
}) => {
  return (
    <div className="relative">
      <div
        className={`absolute -left-7 top-0 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900 ${
          completed ? "bg-green-500 text-white" : "bg-orange-500 text-white"
        }`}
      >
        <Icon size={10} />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <span className="shrink-0 text-[10px] font-medium text-slate-400">
          {date}
        </span>
      </div>
    </div>
  );
};

// =========================================================
// STATUS BADGE
// =========================================================

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
        styles[status] || ""
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

// =========================================================
// PRIORITY BADGE
// =========================================================

const PriorityBadge = ({ priority }) => {
  const styles = {
    Urgent:
      "border-red-100 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400",

    High: "border-orange-100 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",

    Medium:
      "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",

    Low: "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        styles[priority] || ""
      }`}
    >
      {priority}
    </span>
  );
};

// =========================================================
// DATE
// =========================================================

const formatDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");

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

  return `${day} ${months[Number(month) - 1]} ${year}`;
};

// =========================================================
// TIME
// =========================================================

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export default StaffTaskDetails;
