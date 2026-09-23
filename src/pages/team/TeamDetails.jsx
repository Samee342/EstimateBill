import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";

import { RiPrinterLine } from "react-icons/ri";

// ============================================================
// TEMPORARY TEAM DATA
// Replace this later with API data
// ============================================================

const teamMembers = [
  {
    id: "STAFF-1001",
    name: "Ram Thapa",
    phone: "9800000001",
    email: "ram@example.com",
    skill: "Designer",
    status: "Active",
    tasks: 8,
    completedTasks: 5,
    pendingTasks: 3,
    joinedDate: "2026-01-15",
    address: "Butwal, Rupandehi",
    notes: "Handles graphic design and customer artwork.",
    projects: [
      {
        id: "PRJ-1001",
        name: "Business Card Printing",
        customer: "Ram Sharma",
        status: "Completed",
        dueDate: "2026-09-10",
      },
      {
        id: "PRJ-1002",
        name: "Wedding Invitation Cards",
        customer: "Sita Karki",
        status: "Pending",
        dueDate: "2026-09-15",
      },
      {
        id: "PRJ-1005",
        name: "Company Brochure",
        customer: "Mina Rai",
        status: "Printed",
        dueDate: "2026-09-14",
      },
    ],
    activities: [
      {
        title: "Completed design for Business Card Printing",
        date: "2026-09-10",
        type: "completed",
      },
      {
        title: "Started design for Wedding Invitation Cards",
        date: "2026-09-08",
        type: "started",
      },
      {
        title: "Updated Company Brochure design",
        date: "2026-09-06",
        type: "updated",
      },
    ],
  },

  {
    id: "STAFF-1002",
    name: "Shyam Karki",
    phone: "9800000002",
    email: "shyam@example.com",
    skill: "Printer",
    status: "Active",
    tasks: 5,
    completedTasks: 3,
    pendingTasks: 2,
    joinedDate: "2026-02-10",
    address: "Bhairahawa, Rupandehi",
    notes: "Handles printing machine operations.",
    projects: [
      {
        id: "PRJ-1003",
        name: "Restaurant Menu Printing",
        customer: "Hari Thapa",
        status: "Printed",
        dueDate: "2026-09-12",
      },
      {
        id: "PRJ-1006",
        name: "Product Label Printing",
        customer: "Everest Traders",
        status: "Printed",
        dueDate: "2026-09-13",
      },
    ],
    activities: [
      {
        title: "Completed Restaurant Menu Printing",
        date: "2026-09-12",
        type: "completed",
      },
      {
        title: "Started Product Label Printing",
        date: "2026-09-09",
        type: "started",
      },
    ],
  },

  {
    id: "STAFF-1003",
    name: "Hari Gurung",
    phone: "9800000003",
    email: "hari@example.com",
    skill: "Cutting",
    status: "Invited",
    tasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    joinedDate: "2026-09-05",
    address: "Butwal, Rupandehi",
    notes: "New team member.",
    projects: [],
    activities: [],
  },
];

// ============================================================
// HELPERS
// ============================================================

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "Invited":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    case "Disabled":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";

    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";

    case "Printed":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";

    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
};

// ============================================================
// INFO ITEM
// ============================================================

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
        <Icon size={15} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-700 dark:text-slate-300">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// TEAM DETAILS
// ============================================================

const TeamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const member = useMemo(
    () => teamMembers.find((item) => item.id === id),
    [id],
  );

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
              <FaUser size={22} />
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">
              Team Member Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The team member you're looking for does not exist.
            </p>

            <button
              type="button"
              onClick={() => navigate("/team")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <FaArrowLeft size={13} />
              Back to Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`,
    );

    if (confirmed) {
      // API delete will go here later
      navigate("/team");
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ====================================================
            TOP HEADER
        ===================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/team")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-500"
            >
              <FaArrowLeft size={13} />
              Back to Team
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200 sm:text-3xl">
              Team Member Details
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              View staff information, assigned work and activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* DELETE */}
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <FaTrash size={14} />
              Delete Member
            </button>
          </div>
        </div>

        {/* ====================================================
            PROFILE HEADER
        ===================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* AVATAR */}

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  {member.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {/* NAME */}

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {member.name}
                    </h2>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        member.status,
                      )}`}
                    >
                      {member.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">{member.id}</p>

                  <p className="mt-1 text-sm font-medium text-orange-500">
                    {member.skill}
                  </p>
                </div>
              </div>

              {/* CONTACT */}

              <div className="flex flex-wrap gap-2">
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300"
                >
                  <FaPhone size={13} />
                  Call
                </a>

                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300"
                >
                  <FaEnvelope size={14} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            SUMMARY CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL TASKS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Tasks</p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {member.tasks}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                <FaTasks />
              </div>
            </div>
          </div>

          {/* COMPLETED */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed</p>

                <h3 className="mt-1 text-2xl font-bold text-green-600">
                  {member.completedTasks}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <FaCheckCircle />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>

                <h3 className="mt-1 text-2xl font-bold text-yellow-600">
                  {member.pendingTasks}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
                <FaClock />
              </div>
            </div>
          </div>

          {/* PROJECTS */}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Projects</p>

                <h3 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {member.projects.length}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <FaBriefcase />
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            MAIN CONTENT
        ===================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ==================================================
              LEFT COLUMN
          =================================================== */}

          <div className="space-y-6 lg:col-span-1">
            {/* STAFF INFORMATION */}

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Staff Information
                </h2>
              </div>

              <div className="space-y-5 p-5">
                <InfoItem icon={FaUser} label="Full Name" value={member.name} />

                <InfoItem
                  icon={FaPhone}
                  label="Phone Number"
                  value={member.phone}
                />

                <InfoItem
                  icon={FaEnvelope}
                  label="Email Address"
                  value={member.email}
                />

                <InfoItem
                  icon={RiPrinterLine}
                  label="Skill"
                  value={member.skill}
                />

                <InfoItem
                  icon={FaCalendarAlt}
                  label="Joined Date"
                  value={formatDate(member.joinedDate)}
                />

                <InfoItem
                  icon={FaUser}
                  label="Address"
                  value={member.address}
                />
              </div>
            </div>

            {/* NOTES */}

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Notes
                </h2>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {member.notes || "No notes available."}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT COLUMN
          =================================================== */}

          <div className="space-y-6 lg:col-span-2">
            {/* PROJECTS */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                    Assigned Projects
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Projects assigned to this team member
                  </p>
                </div>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  {member.projects.length} Projects
                </span>
              </div>

              {member.projects.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {member.projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400">
                          <RiPrinterLine size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800 transition group-hover:text-orange-500 dark:text-slate-200">
                            {project.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {project.id} • {project.customer}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                            project.status,
                          )}`}
                        >
                          {project.status}
                        </span>

                        <p className="mt-1 text-xs text-slate-400">
                          Due {formatDate(project.dueDate)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-700">
                    <FaBriefcase />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                    No projects assigned
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    This team member has no assigned projects yet.
                  </p>
                </div>
              )}
            </div>

            {/* ACTIVITY */}

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest work performed by this member
                </p>
              </div>

              {member.activities.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {member.activities.map((activity, index) => (
                    <div key={index} className="flex gap-4 px-5 py-4">
                      <div className="relative">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            activity.type === "completed"
                              ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                              : activity.type === "started"
                                ? "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {activity.type === "completed" ? (
                            <FaCheckCircle size={14} />
                          ) : activity.type === "started" ? (
                            <FaClock size={14} />
                          ) : (
                            <FaEdit size={13} />
                          )}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {activity.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-10 text-center text-sm text-slate-400">
                  No activity available.
                </div>
              )}
            </div>

            {/* WORK SUMMARY */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                    Work Summary
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Task completion overview
                  </p>
                </div>

                <FaTasks className="text-orange-500" />
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all"
                  style={{
                    width:
                      member.tasks > 0
                        ? `${(member.completedTasks / member.tasks) * 100}%`
                        : "0%",
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {member.completedTasks} completed
                </span>

                <span className="font-semibold text-orange-500">
                  {member.tasks > 0
                    ? Math.round((member.completedTasks / member.tasks) * 100)
                    : 0}
                  %
                </span>

                <span className="text-slate-500">
                  {member.pendingTasks} pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
