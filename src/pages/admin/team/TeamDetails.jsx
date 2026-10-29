import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaTrash,
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";

import { RiPrinterLine } from "react-icons/ri";
import { getWorkList, deleteTeam } from "../../../api/team";

// ============================================================
// HELPERS
// ============================================================

const getRecords = (response) => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return (
    data?.staff_members ??
    data?.data?.staff_members ??
    data?.results ??
    data?.data?.results ??
    []
  );
};

const getMemberId = (member) =>
  member?.id ?? member?.uuid ?? member?.user_id ?? member?.staff_id;

const formatDate = (date) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatus = (value) => {
  if (value === false) return "Disabled";
  const s = String(value || "Active").toLowerCase();
  if (["invited", "pending_invitation"].includes(s)) return "Invited";
  if (["disabled", "inactive", "deactivated", "false"].includes(s))
    return "Disabled";
  return "Active";
};

const getTaskStatus = (value) => {
  const s = String(value || "Pending").toLowerCase();
  if (s.includes("complete")) return "Completed";
  if (s.includes("print")) return "Printed";
  if (s.includes("progress")) return "In Progress";
  return "Pending";
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Active":
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
    case "Invited":
    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
    case "Disabled":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
    case "Printed":
      return "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
    case "In Progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
    default:
      return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
  }
};

// Derive a display status for a work item, based on its three sub-statuses
const deriveWorkStatus = (item) => {
  const statuses = [
    item.designing_status,
    item.printing_status,
    item.binding_status,
  ].filter(Boolean);

  if (statuses.length === 0) return "Pending";
  if (statuses.every((s) => String(s).toLowerCase() === "completed"))
    return "Completed";
  if (statuses.some((s) => String(s).toLowerCase() === "in_progress"))
    return "In Progress";
  if (statuses.some((s) => String(s).toLowerCase() === "completed"))
    return "Printed";
  return "Pending";
};

// ============================================================
// INFO ITEM
// ============================================================

const InfoItem = ({ icon: Icon, label, value }) => (
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

// ============================================================
// PAGE
// ============================================================

const TeamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [workList, setWorkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==========================================================
  // FETCH: single source is /api/worklist/
  // ==========================================================

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getWorkList();
        if (!active) return;
        setWorkList(getRecords(response));
      } catch (err) {
        console.error("Team member fetch error:", err);
        if (active) {
          setError(
            err?.response?.data?.detail ||
              err?.response?.data?.message ||
              err?.message ||
              "Could not load team member.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [id]);

  // ==========================================================
  // FIND THIS STAFF IN THE WORKLIST
  // ==========================================================

  const rawMember = useMemo(() => {
    if (!id) return null;
    return workList.find((m) => String(getMemberId(m)) === String(id));
  }, [workList, id]);

  // ==========================================================
  // NORMALIZE
  // ==========================================================

  const member = useMemo(() => {
    if (!rawMember) return null;

    const workDetails = Array.isArray(rawMember.work_details)
      ? rawMember.work_details
      : [];

    // Map each slip item into a "project" for display
    const projects = workDetails.map((item, index) => ({
      id: item.id ?? `project-${index}`,
      name:
        item.order_details?.project_name ||
        item.item_description ||
        `Slip #${item.order_details?.slip_no ?? index + 1}`,
      customer:
        item.order_details?.customer_details?.name ||
        item.order_details?.customer_name ||
        "-",
      slipNo: item.order_details?.slip_no,
      status: deriveWorkStatus(item),
      dueDate: item.order_details?.delivery_date || null,
      totalAmount: item.order_details?.total_amount,
      balance: item.order_details?.balance,
      quantity: item.quantity,
      paperType: item.paper_type,
      size: item.size,
    }));

    const completedTasks = projects.filter(
      (p) => p.status === "Completed",
    ).length;
    const pendingTasks = projects.filter((p) =>
      ["Pending", "In Progress", "Printed"].includes(p.status),
    ).length;

    return {
      id: getMemberId(rawMember),
      name:
        rawMember.full_name ||
        rawMember.username ||
        rawMember.email ||
        `Staff #${rawMember.id}`,
      phone: rawMember.phone_no || rawMember.phone || "",
      email: rawMember.email || "",
      skill: rawMember.role
        ? rawMember.role.charAt(0).toUpperCase() + rawMember.role.slice(1)
        : "Staff",
      role: rawMember.role || "staff",
      tenantId: rawMember.tenant_id ?? "",
      status: getStatus(rawMember.status),
      tasks: rawMember.tasks ?? workDetails.length ?? 0,
      completedTasks,
      pendingTasks,
      joinedDate: rawMember.date_joined || rawMember.created_at || null,
      address: rawMember.address || "",
      notes: "",
      projects,
      activities: [],
    };
  }, [rawMember]);

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async () => {
    if (!member) return;
    if (!window.confirm(`Delete ${member.name}?`)) return;

    try {
      setDeleteLoading(true);
      await deleteTeam(member.id);
      window.alert("Team member deleted successfully.");
      navigate("/team");
    } catch (err) {
      console.error("Delete error:", err);
      window.alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete team member.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading team member...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-slate-800">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Could Not Load Team Member
          </h1>
          <p className="mt-3 break-words text-sm text-red-500">{error}</p>
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
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10">
              <FaUser size={22} />
            </div>
            <h1 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">
              Team Member Not Found
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No staff member matching ID <strong>{id}</strong>.
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
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
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
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <FaTrash size={14} />
              {deleteLoading ? "Deleting..." : "Delete Member"}
            </button>
          </div>
        </div>

        {/* PROFILE HEADER */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  {member.name
                    .split(" ")
                    .filter(Boolean)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "TM"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {member.name}
                    </h2>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(member.status)}`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-slate-400">
                    Staff ID: {member.id}
                  </p>
                  <p className="mt-1 text-sm font-medium text-orange-500">
                    {member.skill}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300"
                  >
                    <FaPhone size={13} />
                    Call
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-orange-200 hover:text-orange-500 dark:border-slate-700 dark:text-slate-300"
                  >
                    <FaEnvelope size={14} />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Staff Information
                </h2>
              </div>
              <div className="space-y-5 p-5">
                <InfoItem icon={FaUser} label="Name" value={member.name} />
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
                  label="Role"
                  value={member.skill}
                />
                <InfoItem
                  icon={FaCalendarAlt}
                  label="Joined Date"
                  value={formatDate(member.joinedDate)}
                />
                <InfoItem
                  icon={FaUser}
                  label="Tenant ID"
                  value={member.tenantId}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 lg:col-span-2">
            {/* ASSIGNED PROJECTS */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                    Assigned Work
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Slip items assigned to this team member
                  </p>
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  {member.projects.length} Items
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
                            {project.customer}
                            {project.slipNo ? ` • Slip #${project.slipNo}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(project.status)}`}
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
                    No work assigned
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    This staff member has no slip items assigned yet.
                  </p>
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
                        ? `${Math.min(100, (member.completedTasks / member.tasks) * 100)}%`
                        : "0%",
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-xs">
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
