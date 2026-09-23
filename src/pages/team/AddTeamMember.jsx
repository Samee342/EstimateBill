import React, { useState } from "react";
import {
  FaArrowLeft,
  FaUserPlus,
  FaWhatsapp,
  FaLink,
  FaCopy,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaLock,
  FaPaperPlane,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddTeamMember = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("invite");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    skill: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // INVITE LINK
  // =========================

  const inviteLink =
    `${window.location.origin}/staff/invite/` +
    encodeURIComponent(formData.phone || "INVITE_TOKEN");

  // =========================
  // WHATSAPP MESSAGE
  // =========================

  const whatsappMessage = `
Hello ${formData.name || "there"} 👋

You have been invited to join our PrintTech team.

Role: ${formData.skill || "Team Member"}

Please use the invitation link below to create your account:

${inviteLink}

This invitation is for your PrintTech staff account.

Thank you.
PrintTech
  `.trim();

  // =========================
  // WHATSAPP INVITE
  // =========================

  const handleWhatsAppInvite = () => {
    if (!formData.phone) {
      alert("Please enter phone number first.");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");

    const whatsappUrl =
      `https://wa.me/977${cleanPhone}?text=` +
      encodeURIComponent(whatsappMessage);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // =========================
  // COPY INVITE LINK
  // =========================

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // =========================
  // MANUAL ADD
  // =========================

  const handleManualSubmit = (e) => {
    e.preventDefault();

    console.log("Manual Team Member:", formData);

    alert("Team member added successfully!");

    navigate("/team");
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 dark:bg-slate-950">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/team")}
            className="
              flex h-10 w-10 shrink-0 items-center
              justify-center rounded-xl
              border border-slate-200
              bg-white text-slate-600
              shadow-sm transition
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
            "
          >
            <FaArrowLeft size={15} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900 md:text-2xl dark:text-white">
              Add Team Member
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Add staff manually or invite them to join PrintTech.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MODE SWITCH
      ====================================================== */}

      <div className="mb-6 grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
        {/* INVITE */}

        <button
          type="button"
          onClick={() => setMode("invite")}
          className={`
            group rounded-2xl border p-4 text-left
            transition-all duration-200
            ${
              mode === "invite"
                ? "border-orange-300 bg-orange-50 shadow-sm dark:border-orange-500/40 dark:bg-orange-500/10"
                : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/50 dark:border-slate-700 dark:bg-slate-900"
            }
          `}
        >
          <div className="flex items-start gap-4">
            <div
              className={`
                flex h-11 w-11 shrink-0 items-center
                justify-center rounded-xl
                ${
                  mode === "invite"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }
              `}
            >
              <FaPaperPlane />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Invite Team Member
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Send an invitation through WhatsApp or share an invite link.
              </p>
            </div>
          </div>
        </button>

        {/* MANUAL */}

        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`
            group rounded-2xl border p-4 text-left
            transition-all duration-200
            ${
              mode === "manual"
                ? "border-orange-300 bg-orange-50 shadow-sm dark:border-orange-500/40 dark:bg-orange-500/10"
                : "border-slate-200 bg-white hover:border-orange-200 dark:hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900"
            }
          `}
        >
          <div className="flex items-start gap-4">
            <div
              className={`
                flex h-11 w-11 shrink-0 items-center
                justify-center rounded-xl
                ${
                  mode === "manual"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }
              `}
            >
              <FaUserPlus />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Add Manually
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Create the staff account directly from the admin panel.
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {/* CARD HEADER */}

        <div className="border-b border-slate-200 px-5 py-5 md:px-6 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
              {mode === "invite" ? <FaPaperPlane /> : <FaUserPlus />}
            </div>

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">
                {mode === "invite"
                  ? "Send Staff Invitation"
                  : "Create Team Member"}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === "invite"
                  ? "The staff member will complete their own account setup."
                  : "Create login credentials for the staff member."}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={
            mode === "manual" ? handleManualSubmit : (e) => e.preventDefault()
          }
          className="p-5 md:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>

              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ram Thapa"
                  required
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-4
                    text-sm outline-none
                    transition
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-orange-100
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                    dark:focus:bg-slate-800
                  "
                />
              </div>
            </div>

            {/* PHONE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                WhatsApp / Phone
              </label>

              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  required
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-4
                    text-sm outline-none
                    transition
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-orange-100
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                    dark:focus:bg-slate-800
                  "
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ram@example.com"
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-4
                    text-sm outline-none
                    transition
                    focus:border-orange-400
                    focus:ring-2
                    focus:ring-orange-100
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                    dark:focus:bg-slate-800
                  "
                />
              </div>
            </div>

            {/* SKILL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Skill / Department
              </label>

              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <select
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                  className="
                    w-full appearance-none
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-10 pr-4
                    text-sm outline-none
                    transition
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-orange-100
                    dark:border-slate-700
                    dark:bg-slate-800
                    dark:text-white
                  "
                >
                  <option value="">Select department</option>

                  <option value="Designer">Designer</option>

                  <option value="Pre-Press">Pre-Press</option>

                  <option value="Printer">Printer</option>

                  <option value="Cutting">Cutting</option>

                  <option value="Lamination">Lamination</option>

                  <option value="Binding">Binding</option>

                  <option value="Finishing">Finishing</option>

                  <option value="Packing">Packing</option>

                  <option value="Quality Check">Quality Check</option>

                  <option value="Delivery">Delivery</option>
                </select>
              </div>
            </div>

            {/* PASSWORD ONLY MANUAL */}

            {mode === "manual" && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Temporary Password
                </label>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create temporary password"
                    required
                    className="
                      w-full rounded-xl
                      border border-slate-200
                      bg-slate-50
                      py-3 pl-10 pr-4
                      text-sm outline-none
                      transition
                      focus:border-orange-400
                      focus:ring-2
                      focus:ring-orange-100
                      dark:border-slate-700
                      dark:bg-slate-800
                      dark:text-white
                      dark:focus:bg-slate-800
                    "
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  The staff member can change this password after login.
                </p>
              </div>
            )}
          </div>

          {/* =====================================================
              INVITE ACTIONS
          ====================================================== */}

          {mode === "invite" && (
            <div className="mt-6 space-y-4">
              {/* WHATSAPP */}

              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-500/20 dark:bg-green-500/10">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                      <FaWhatsapp size={20} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-400">
                        Invite through WhatsApp
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-green-700 dark:text-green-300">
                        Open WhatsApp with a ready-made invitation message and
                        invite link.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppInvite}
                    className="
                      flex shrink-0 items-center
                      justify-center gap-2
                      rounded-xl
                      bg-green-500
                      px-5 py-2.5
                      text-sm font-semibold
                      text-white
                      transition
                      hover:bg-green-600
                    "
                  >
                    <FaWhatsapp />
                    Send WhatsApp Invite
                  </button>
                </div>
              </div>

              {/* INVITE LINK */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex items-center gap-2">
                  <FaLink className="text-orange-500" />

                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                    Invitation Link
                  </h3>
                </div>

                <div className="flex flex-col gap-2 md:flex-row">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="
                      min-w-0 flex-1
                      rounded-xl
                      border border-slate-200
                      bg-white
                      px-4 py-2.5
                      text-xs text-slate-500
                      outline-none
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-400
                    "
                  />

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="
                      flex items-center
                      justify-center gap-2
                      rounded-xl
                      border border-slate-200
                      bg-white
                      px-4 py-2.5
                      text-sm font-medium
                      text-slate-700
                      transition
                      hover:bg-slate-100
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    "
                  >
                    {copied ? (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaCopy />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* INFORMATION */}

              <div className="flex gap-3 rounded-xl bg-orange-50 p-4 dark:bg-orange-500/10">
                <FaCheckCircle className="mt-0.5 shrink-0 text-orange-500" />

                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    How invitation works
                  </p>

                  <p className="mt-1 text-xs leading-5 text-orange-700 dark:text-orange-400">
                    Staff receives the invitation, opens the link, creates their
                    account and then gets access to the Staff Dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================
              FOOTER ACTIONS
          ====================================================== */}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/team")}
              className="
                rounded-xl
                border border-slate-200
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-slate-700
                transition
                hover:bg-slate-50
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              Cancel
            </button>

            {mode === "manual" && (
              <button
                type="submit"
                className="
                  flex items-center
                  justify-center gap-2
                  rounded-xl
                  bg-orange-500
                  px-5 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-orange-600
                "
              >
                <FaUserPlus />
                Create Team Member
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMember;
