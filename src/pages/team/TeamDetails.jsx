import React, { useEffect, useMemo, useState } from "react";
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
import { getTeam } from "../../api/team";
// ============================================================
// HELPERS
// ============================================================

const getResponseData = (response) => {
  return response?.data ?? response;
};

const getRecords = (response) => {
  const data = getResponseData(response);

  if (Array.isArray(data)) return data;

  const possibleArrays = [
    data?.staff_members,
    data?.team_members,
    data?.results,
    data?.members,
    data?.staff,
    data?.employees,
    data?.teams,
    data?.team,
    data?.data?.staff_members,
    data?.data?.results,
    data?.data?.members,
    data?.data?.staff,
    data?.data?.employees,
    data?.data?.teams,
    data?.data?.team,
  ];

  return possibleArrays.find(Array.isArray) || [];
};

const getErrorDetails = (error) => {
  const responseData = error?.response?.data;

  let message =
    responseData?.detail ||
    responseData?.message ||
    responseData?.error ||
    responseData?.errors ||
    error?.message ||
    "An unexpected error occurred.";

  if (typeof message === "object") {
    message = JSON.stringify(message, null, 2);
  }

  return {
    message: String(message),
    status: error?.response?.status ?? "No HTTP status",
    statusText: error?.response?.statusText || "",
    response: responseData ?? null,
    url: error?.config?.url || "",
    method: error?.config?.method?.toUpperCase() || "",
    code: error?.code || "",
  };
};

const getMemberId = (member) =>
  member?.id ??
  member?.uuid ??
  member?.user_id ??
  member?.user?.id ??
  member?.staff_id ??
  member?.member_id;

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatus = (value) => {
  if (value === false) return "Disabled";

  const status = String(value || "Active").toLowerCase();

  if (
    ["invited", "pending_invitation", "invitation pending"].includes(status)
  ) {
    return "Invited";
  }

  if (["disabled", "inactive", "deactivated", "false"].includes(status)) {
    return "Disabled";
  }

  return "Active";
};

const getTaskStatus = (value) => {
  const status = String(value || "Pending").toLowerCase();

  if (status.includes("complete")) return "Completed";
  if (status.includes("print")) return "Printed";
  if (status.includes("progress")) return "In Progress";

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

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // ==========================================================

  useEffect(() => {
    let active = true;

    const fetchTeam = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTeam();

        const responseData = response?.data ?? response;

        // Your API returns staff inside "staff_members".
        const records = Array.isArray(responseData)
          ? responseData
          : (responseData?.staff_members ??
            responseData?.data?.staff_members ??
            responseData?.results ??
            responseData?.data?.results ??
            []);

        console.log("========== TEAM API RESPONSE ==========");
        console.log("Raw response:", response);
        console.log("Response data:", responseData);
        console.log("Extracted team records:", records);
        console.log("Route member ID:", id);
        console.log(
          "Available staff IDs:",
          records.map((staff) => staff.id),
        );
        console.log("========================================");

        if (!active) return;

        setMembers(records);
      } catch (err) {
        const responseData = err?.response?.data;

        const message =
          responseData?.detail ||
          responseData?.message ||
          responseData?.error ||
          err?.message ||
          "An unexpected error occurred.";

        console.error("========== TEAM API ERROR ==========");
        console.error("Error message:", message);
        console.error("HTTP status:", err?.response?.status);
        console.error("Status text:", err?.response?.statusText);
        console.error("Request URL:", err?.config?.url);
        console.error("Request method:", err?.config?.method);
        console.error("Response body:", responseData);
        console.error("Response headers:", err?.response?.headers);
        console.error("Error code:", err?.code);
        console.error("Full error object:", err);
        console.error("====================================");

        if (active) {
          setError(
            `${
              typeof message === "object" ? JSON.stringify(message) : message
            } | HTTP: ${err?.response?.status ?? "No HTTP status"}`,
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTeam();

    return () => {
      active = false;
    };
  }, [id, retryCount]);

  // ==========================================================
  // FIND MEMBER USING THE ROUTE ID
  // Handles numeric IDs and string IDs.
  // ==========================================================

  const rawMember = useMemo(() => {
    if (!id) return null;

    return members.find((item) => String(getMemberId(item)) === String(id));
  }, [members, id]);

  // ==========================================================
  // NORMALIZE THE REAL API RESPONSE
  // ==========================================================

  const member = useMemo(() => {
    if (!rawMember) return null;

    const assignedProjects =
      rawMember.projects ??
      rawMember.assigned_projects ??
      rawMember.tasks_list ??
      [];

    const activities =
      rawMember.activities ??
      rawMember.recent_activities ??
      rawMember.activity_logs ??
      [];

    const normalizedProjects = Array.isArray(assignedProjects)
      ? assignedProjects.map((project, index) => ({
          id: project.id ?? project.uuid ?? `project-${index}`,
          name:
            project.project_name ||
            project.name ||
            project.title ||
            `Project ${index + 1}`,
          customer:
            project.customer_details?.name ||
            project.customer_name ||
            project.customer?.name ||
            (typeof project.customer === "string" ? project.customer : "-"),
          status: getTaskStatus(
            project.status || project.work_stage || project.work_status,
          ),
          dueDate:
            project.delivery_date ||
            project.due_date ||
            project.deadline ||
            null,
        }))
      : [];

    const normalizedActivities = Array.isArray(activities)
      ? activities.map((activity, index) => ({
          title:
            activity.title ||
            activity.description ||
            activity.action ||
            activity.message ||
            "Team activity",
          date:
            activity.date || activity.created_at || activity.timestamp || null,
          type: activity.type || activity.status || "updated",
          id: activity.id ?? index,
        }))
      : [];

    const completedTasks = Number(
      rawMember.completed_tasks ??
        rawMember.completedTasks ??
        rawMember.completed_count ??
        normalizedProjects.filter((project) => project.status === "Completed")
          .length,
    );

    const pendingTasks = Number(
      rawMember.pending_tasks ??
        rawMember.pendingTasks ??
        rawMember.pending_count ??
        normalizedProjects.filter(
          (project) =>
            project.status === "Pending" || project.status === "In Progress",
        ).length,
    );

    const totalTasks = Number(
      rawMember.total_tasks ??
        rawMember.tasks_count ??
        rawMember.assigned_tasks_count ??
        (Array.isArray(rawMember.tasks) ? rawMember.tasks.length : undefined) ??
        completedTasks + pendingTasks,
    );

    const firstName = rawMember.first_name || rawMember.user?.first_name || "";

    const lastName = rawMember.last_name || rawMember.user?.last_name || "";

    const fullName =
      rawMember.name ||
      rawMember.full_name ||
      rawMember.username ||
      rawMember.user?.name ||
      rawMember.user?.full_name ||
      rawMember.user?.username ||
      `${firstName} ${lastName}`.trim();

    return {
      id: getMemberId(rawMember),

      // Your API uses username, so use it as the display name.
      name: fullName || "Unnamed Team Member",

      phone:
        rawMember.phone_no ||
        rawMember.phone ||
        rawMember.phone_number ||
        rawMember.contact_no ||
        rawMember.mobile ||
        rawMember.user?.phone_no ||
        rawMember.user?.phone ||
        "",

      email: rawMember.email || rawMember.user?.email || "",

      // "staff" is the account role, not the person's department.
      skill:
        rawMember.department ||
        rawMember.role_name ||
        rawMember.position ||
        rawMember.designation ||
        rawMember.skill ||
        rawMember.role ||
        "Staff",

      role: rawMember.role || "staff",

      tenantId:
        rawMember.tenant_id ?? rawMember.tenant?.id ?? rawMember.tenant ?? "",

      status: getStatus(
        rawMember.status ||
          rawMember.member_status ||
          rawMember.account_status ||
          (rawMember.is_active === false ? "Disabled" : "Active"),
      ),

      tasks: totalTasks,
      completedTasks,
      pendingTasks,

      joinedDate:
        rawMember.joined_date ||
        rawMember.date_joined ||
        rawMember.created_at ||
        rawMember.created ||
        null,

      address:
        rawMember.address ||
        rawMember.location ||
        rawMember.user?.address ||
        "",

      notes: rawMember.notes || rawMember.description || "",

      projects: normalizedProjects,
      activities: normalizedActivities,
    };
  }, [rawMember]);

  // ==========================================================
  // DELETE MEMBER
  // ==========================================================

  const handleDelete = async () => {
    if (!member) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}?`,
    );

    if (!confirmed) return;

    const deleteFunction =
      teamApi.deleteTeamMember ||
      teamApi.deleteTeam ||
      teamApi.deleteStaff ||
      teamApi.deleteEmployee;

    if (typeof deleteFunction !== "function") {
      console.error(
        "No delete function was found in ../../api/team.",
        Object.keys(teamApi),
      );

      window.alert(
        "The delete API is not available in ../../api/team. No record was deleted.",
      );

      return;
    }

    try {
      await deleteFunction(member.id);

      window.alert("Team member deleted successfully.");
      navigate("/team");
    } catch (err) {
      const details = getErrorDetails(err);

      console.error("========== DELETE STAFF ERROR ==========");
      console.error("Message:", details.message);
      console.error("HTTP status:", details.status);
      console.error("Status text:", details.statusText);
      console.error("Request URL:", details.url);
      console.error("Request method:", details.method);
      console.error("Response body:", details.response);
      console.error("Full error:", err);
      console.error("========================================");

      window.alert(
        `Could not delete team member.\n${details.message}\nHTTP: ${details.status}`,
      );
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
  // API ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-500/20 dark:bg-slate-800">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Could Not Load Team Member
          </h1>

          <p className="mt-3 break-words text-sm text-red-500">{error}</p>

          <p className="mt-3 text-xs text-slate-400">
            Open the browser console for the complete API response and error
            details.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() => navigate("/team")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
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
  // MEMBER NOT FOUND
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

            <p className="mt-2 break-words text-sm text-slate-500 dark:text-slate-400">
              No staff member matching ID <strong>{id}</strong> was found in the
              API response.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Check the console for the API response and available staff IDs.
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
        {/* TOP HEADER */}

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
              className="inline-flex w-40 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:hover:bg-red-500/20"
            >
              <FaTrash size={14} />
              Delete Member
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
                    .map((word) => word[0])
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
          {/* LEFT COLUMN */}

          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Staff Information
                </h2>
              </div>

              <div className="space-y-5 p-5">
                <InfoItem icon={FaUser} label="Username" value={member.name} />

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
                  label="Role / Department"
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

                <InfoItem
                  icon={FaUser}
                  label="Address"
                  value={member.address}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Notes
                </h2>
              </div>

              <div className="p-5">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {member.notes || "No notes provided by the API."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6 lg:col-span-2">
            {/* ASSIGNED PROJECTS */}

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
                    No assigned projects returned
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    The current staff API response does not include project
                    assignments.
                  </p>
                </div>
              )}
            </div>

            {/* RECENT ACTIVITY */}

            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Latest work activity returned by the API
                </p>
              </div>

              {member.activities.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {member.activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 px-5 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                        {String(activity.type)
                          .toLowerCase()
                          .includes("complete") ? (
                          <FaCheckCircle size={14} />
                        ) : String(activity.type)
                            .toLowerCase()
                            .includes("start") ? (
                          <FaClock size={14} />
                        ) : (
                          <FaEdit size={13} />
                        )}
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
                  No activity data was returned by the API.
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
                        ? `${Math.min(
                            100,
                            (member.completedTasks / member.tasks) * 100,
                          )}%`
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

              <p className="mt-3 text-xs text-slate-400">
                Task counts are shown only when supplied by the API. The current
                staff response does not include task counts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
