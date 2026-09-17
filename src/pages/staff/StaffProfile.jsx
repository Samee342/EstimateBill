import React from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

import { getCurrentUser } from "../../utils/auth";

const StaffProfile = () => {
  const user = getCurrentUser();

  const userName = user?.name || "Staff Member";
  const userEmail = user?.email || "Not available";
  const userRole = user?.role || "staff";

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage and view your PrintTech staff account information.
        </p>
      </div>

      {/* =====================================================
          PROFILE HERO
      ====================================================== */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400">
          {/* Decorative circles */}
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[30px] border-white/10" />

          <div className="absolute right-24 top-10 h-20 w-20 rounded-full bg-white/10" />

          <div className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-white/10" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-white/5" />
        </div>

        {/* Profile Content */}
        <div className="px-5 pb-6 md:px-7">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* User */}
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-orange-100 text-3xl font-bold text-orange-600 shadow-lg dark:border-slate-900 dark:bg-orange-500/10 dark:text-orange-400">
                  {userInitial}
                </div>

                {/* Online indicator */}
                <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500 dark:border-slate-900" />
              </div>

              {/* Name */}
              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                  {userName}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Production Staff
                  </span>

                  <span className="h-1 w-1 rounded-full bg-slate-300" />

                  <span className="text-sm capitalize text-slate-500 dark:text-slate-400">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Badge */}
            <div className="flex w-fit items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>

              Active Account
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          QUICK STATS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FiActivity}
          label="Account Status"
          value="Active"
          iconBg="bg-green-50 dark:bg-green-500/10"
          iconColor="text-green-600 dark:text-green-400"
          valueColor="text-green-600 dark:text-green-400"
        />

        <StatCard
          icon={FiBriefcase}
          label="Department"
          value="Production"
          iconBg="bg-orange-50 dark:bg-orange-500/10"
          iconColor="text-orange-600 dark:text-orange-400"
        />

        <StatCard
          icon={FiClock}
          label="Workspace"
          value="Staff Panel"
          iconBg="bg-blue-50 dark:bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =================================================
            PERSONAL INFORMATION
        ================================================== */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <FiUser size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Your basic account details
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2">
              <ProfileItem
                icon={FiUser}
                label="Full Name"
                value={userName}
              />

              <ProfileItem
                icon={FiMail}
                label="Email Address"
                value={userEmail}
              />

              <ProfileItem
                icon={FiPhone}
                label="Phone Number"
                value={user?.phone || "Not added"}
              />

              <ProfileItem
                icon={FiMapPin}
                label="Location"
                value={user?.address || "Not added"}
              />
            </div>
          </div>
        </div>

        {/* =================================================
            WORK INFORMATION
        ================================================== */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <FiBriefcase size={18} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Work Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Your workspace role
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1 p-4">
              <InfoRow
                icon={FiShield}
                label="Role"
                value="Staff"
              />

              <InfoRow
                icon={FiBriefcase}
                label="Department"
                value="Production"
              />

              <InfoRow
                icon={FiCheckCircle}
                label="Status"
                value="Active"
                valueClass="text-green-600 dark:text-green-400"
              />

              <InfoRow
                icon={FiCalendar}
                label="Access"
                value="Staff Workspace"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          WORKSPACE PERMISSIONS
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* What Staff Can Do */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              <FiCheckCircle size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Your Workspace Access
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your staff account is designed to help you focus on
                production work assigned to you.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <PermissionItem text="View assigned tasks" />
            <PermissionItem text="Update task status" />
            <PermissionItem text="Update progress" />
            <PermissionItem text="View assigned orders" />
            <PermissionItem text="View customer details" />
            <PermissionItem text="Track production work" />
          </div>
        </div>

        {/* Account Security */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <FiShield size={19} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Account Security
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your account access is controlled by your PrintTech
                workspace role.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <SecurityRow
              label="Authentication"
              value="Email & Password"
            />

            <SecurityRow
              label="Account Type"
              value="Staff Account"
            />

            <SecurityRow
              label="Access Level"
              value="Production"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          INFO BANNER
      ====================================================== */}
      <div className="overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 dark:border-orange-500/10 dark:bg-orange-500/5">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <FiBriefcase size={19} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-orange-800 dark:text-orange-300">
              Keep your production work updated
            </h3>

            <p className="mt-1 text-sm leading-6 text-orange-700/80 dark:text-orange-300/70">
              Update your assigned task status and progress regularly so
              the admin can track the complete production workflow.
            </p>
          </div>

          <div className="hidden shrink-0 rounded-xl border border-orange-200 bg-white/60 px-4 py-2 text-xs font-semibold text-orange-700 sm:block dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
            PrintTech Staff
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  valueColor = "text-slate-900 dark:text-white",
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>

          <p className={`mt-2 text-lg font-bold ${valueColor}`}>
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PROFILE ITEM
========================================================= */

const ProfileItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="group rounded-xl p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-orange-50 group-hover:text-orange-500 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-400">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-800 dark:text-slate-200",
}) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Icon size={15} />
        </div>

        <span className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>

      <span className={`text-sm font-semibold ${valueClass}`}>
        {value}
      </span>
    </div>
  );
};

/* =========================================================
   PERMISSION ITEM
========================================================= */

const PermissionItem = ({ text }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">
      <FiCheckCircle
        size={15}
        className="shrink-0 text-green-500"
      />

      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {text}
      </span>
    </div>
  );
};

/* =========================================================
   SECURITY ROW
========================================================= */

const SecurityRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800/60">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
};

export default StaffProfile;