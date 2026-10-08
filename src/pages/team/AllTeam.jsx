import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserCheck,
  FaUserClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import DeleteModal from "../../modal/DeleteModal";
import { getTeam, deleteTeam } from "../../api/team";
import toast from "react-hot-toast";

const AllTeam = () => {
  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =====================================================
  // GET TEAM MEMBERS
  // =====================================================

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await getTeam();

        console.log("Team API response:", response);

        if (Array.isArray(response?.staff_members)) {
          setTeamMembers(response.staff_members);
        } else {
          setTeamMembers([]);
        }
      } catch (error) {
        console.error("Get team members error:", error);
        setTeamMembers([]);
      }
    };

    fetchTeam();
  }, []);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const searchText = search.toLowerCase().trim();

      const name = String(member?.name || member?.username || "").toLowerCase();

      const phone = String(
        member?.phone || member?.phone_no || "",
      ).toLowerCase();

      const skill = String(
        member?.skill || member?.department || "",
      ).toLowerCase();

      const matchesSearch =
        name.includes(searchText) ||
        phone.includes(searchText) ||
        skill.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        String(member?.status || "").toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [teamMembers, search, statusFilter]);

  // =====================================================
  // SUMMARY DATA
  // =====================================================

  const totalMembers = teamMembers.length;

  const activeMembers = teamMembers.filter(
    (member) => String(member?.status || "").toLowerCase() === "active",
  ).length;

  const invitedMembers = teamMembers.filter(
    (member) => String(member?.status || "").toLowerCase() === "invited",
  ).length;

  // =====================================================
  // OPEN DELETE MODAL
  // =====================================================

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setDeleteModalOpen(true);
  };

  // =====================================================
  // CONFIRM DELETE
  // =====================================================

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;

    try {
      setDeleteLoading(true);

      const memberUuid = selectedMember.uuid || selectedMember.id;

      await deleteTeam(memberUuid);

      setTeamMembers((prev) =>
        prev.filter((member) => (member.uuid || member.id) !== memberUuid),
      );

      setDeleteModalOpen(false);
      setSelectedMember(null);

      toast.success("Team member deleted successfully!");
    } catch (error) {
      console.error("Delete team member error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete team member. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =====================================================
  // CLOSE DELETE MODAL
  // =====================================================

  const handleDeleteClose = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-300">
            Team
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your printing press staff and team members.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/team/add")}
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 font-medium text-white transition hover:bg-orange-600"
          >
            <FaPlus />
            Add Team Member
          </button>

          <button
            type="button"
            onClick={() => alert("Invite feature will be added next.")}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FaUserPlus />
            Invite
          </button>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Members</p>

              <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-300">
                {totalMembers}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <FaUsers />
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active</p>

              <h2 className="mt-1 text-2xl font-bold text-green-600 dark:text-slate-200">
                {activeMembers}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <FaUserCheck />
            </div>
          </div>
        </div>

        {/* Invited */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Invited</p>

              <h2 className="mt-1 text-2xl font-bold text-yellow-600 dark:text-slate-200">
                {invitedMembers}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
              <FaUserClock />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-800">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or skill..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-400 dark:bg-slate-700 dark:text-slate-300"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Member
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Skill
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Tasks
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const memberUuid = member.uuid || member.id;

                  return (
                    <tr
                      key={memberUuid}
                      className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      {/* Member */}

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/team/${memberUuid}`)}
                          className="group text-left"
                        >
                          <p className="font-semibold text-slate-800 transition group-hover:text-orange-500 dark:text-slate-300">
                            {member.name || member.username || "Unnamed Member"}
                          </p>

                          <p className="text-xs text-slate-500">{memberUuid}</p>
                        </button>
                      </td>

                      {/* Phone */}

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {member.phone || member.phone_no || "-"}
                      </td>

                      {/* Skill */}

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {member.skill || member.department || "-"}
                      </td>

                      {/* Tasks */}

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {member.tasks ?? 0}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            String(member.status || "").toLowerCase() ===
                            "active"
                              ? "bg-green-100 text-green-700"
                              : String(member.status || "").toLowerCase() ===
                                  "invited"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {member.status || "Disabled"}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(member)}
                          className="rounded-lg bg-red-100 px-3 py-2 text-red-700 transition hover:bg-red-200"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Team Member"
        message="Are you sure you want to remove this team member? This action cannot be undone."
        itemName={
          selectedMember
            ? `${
                selectedMember.name || selectedMember.username || "Team Member"
              } • ${
                selectedMember.skill || selectedMember.department || "No skill"
              }`
            : ""
        }
        loading={deleteLoading}
      />
    </div>
  );
};

export default AllTeam;
