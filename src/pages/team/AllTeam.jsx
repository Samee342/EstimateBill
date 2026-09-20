import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaUserPlus,
  FaUsers,
  FaUserCheck,
  FaUserClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";

const initialTeamMembers = [
  {
    id: "STAFF-1001",
    name: "Ram Thapa",
    phone: "9800000001",
    email: "ram@example.com",
    skill: "Designer",
    status: "Active",
    tasks: 8,
  },
  {
    id: "STAFF-1002",
    name: "Shyam Karki",
    phone: "9800000002",
    email: "shyam@example.com",
    skill: "Printer",
    status: "Active",
    tasks: 5,
  },
  {
    id: "STAFF-1003",
    name: "Hari Gurung",
    phone: "9800000003",
    email: "hari@example.com",
    skill: "Cutting",
    status: "Invited",
    tasks: 0,
  },
];

const AllTeam = () => {
  const navigate = useNavigate();

  const [teamMembers] = useState(initialTeamMembers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(searchText) ||
        member.phone.includes(search) ||
        member.skill.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teamMembers, search, statusFilter]);

  const totalMembers = teamMembers.length;

  const activeMembers = teamMembers.filter(
    (member) => member.status === "Active",
  ).length;

  const invitedMembers = teamMembers.filter(
    (member) => member.status === "Invited",
  ).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-300">
            Team
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your printing press staff and team members.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/team/add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
          >
            <FaPlus />
            Add Team Member
          </button>

          <button
            onClick={() => alert("Invite feature will be added next.")}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition"
          >
            <FaUserPlus />
            Invite
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between ">
            <div>
              <p className="text-sm text-slate-500">Total Members</p>

              <h2 className="text-2xl font-bold text-slate-800 mt-1 dark:text-slate-300">
                {totalMembers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <FaUsers />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active</p>

              <h2 className="text-2xl font-bold text-green-600 mt-1 dark:text-slate-200">
                {activeMembers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <FaUserCheck />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Invited</p>

              <h2 className="text-2xl font-bold text-yellow-600 mt-1 dark:text-slate-200">
                {invitedMembers}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <FaUserClock />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone or skill..."
              className="w-full pl-10 pr-4 py-2.5 border dark:text-slate-300 border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg outline-none bg-white dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200">
              <tr>
                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Member
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Phone
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Skill
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Tasks
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-300">
                          {member.name}
                        </p>

                        <p className="text-xs text-slate-500">{member.id}</p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {member.phone}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {member.skill}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {member.tasks}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : member.status === "Invited"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button className=" px-3 py-2  bg-red-100 hover:bg-red-200 text-red-700 rounded-lg">
                        <RiDeleteBinLine />
                      </button>
                    </td>
                  </tr>
                ))
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
    </div>
  );
};

export default AllTeam;
