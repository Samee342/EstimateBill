import { useEffect, useState } from "react";
import {
  FiUser,
  FiBriefcase,
  FiFileText,
  FiCreditCard,
  FiBell,
  FiPrinter,
  FiSave,
  FiCamera,
} from "react-icons/fi";

const STORAGE_KEY = "printing_press_studio_settings";

const defaultSettings = {
  // PROFILE
  profileName: "Admin User",
  profileEmail: "admin@printtech.com",
  profilePhone: "9800000000",
  profileRole: "Administrator",

  // BUSINESS
  businessName: "PrintTech Printing Press",
  ownerName: "Ram Sharma",
  businessPhone: "9812345678",
  businessEmail: "info@printtech.com",
  address: "Butwal, Rupandehi, Nepal",
  panVat: "123456789",

  // INVOICE
  invoicePrefix: "INV-",
  estimatePrefix: "EST-",
  currency: "NPR",
  taxEnabled: true,
  taxRate: 13,
  showLogo: true,
  showCustomerPan: true,
  showSignature: true,

  // PAYMENT
  defaultPaymentMethod: "Cash",
  partialPayment: true,
  dueReminder: true,
  reminderDays: 1,

  // NOTIFICATIONS
  newProject: true,
  paymentReceived: true,
  paymentDue: true,
  projectCompleted: true,
  lowStock: true,

  // PRINTING
  defaultPriority: "Normal",
  defaultProjectStatus: "Pending",
  defaultWorkType: "Digital Printing",
};

const StudioSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        return {
          ...defaultSettings,
          ...JSON.parse(saved),
        };
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }

    return defaultSettings;
  });

  const [savedMessage, setSavedMessage] = useState("");

  // Automatically save settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Handle input / checkbox / select changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save button
  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    setSavedMessage("Settings saved successfully.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  // Common input classes
  const inputClass =
    "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-orange-400 dark:focus:border-orange-500 transition";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-slate-950 px-4 py-5 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* =========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Studio Settings
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your profile, printing press and system preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedMessage && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {savedMessage}
              </span>
            )}

            <button
              type="button"
              onClick={saveSettings}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              <FiSave size={16} />
              Save Changes
            </button>
          </div>
        </div>

        {/* =========================================
            MAIN GRID
        ========================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
          {/* =========================================
              LEFT SETTINGS MENU
          ========================================== */}

          <div className="h-fit rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 transition-colors">
            <div className="space-y-1">
              {/* PROFILE */}

              <a
                href="#profile"
                className="flex items-center gap-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 px-3 py-2.5 text-sm font-semibold text-orange-600 dark:text-orange-400"
              >
                <FiUser size={16} />
                Profile
              </a>

              {/* BUSINESS */}

              <a
                href="#business"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiBriefcase size={16} />
                Business
              </a>

              {/* INVOICE */}

              <a
                href="#invoice"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiFileText size={16} />
                Invoice & Estimate
              </a>

              {/* PAYMENT */}

              <a
                href="#payment"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiCreditCard size={16} />
                Payment
              </a>

              {/* NOTIFICATIONS */}

              <a
                href="#notification"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiBell size={16} />
                Notifications
              </a>

              {/* PRINTING */}

              <a
                href="#printing"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                <FiPrinter size={16} />
                Printing
              </a>
            </div>
          </div>

          {/* =========================================
              RIGHT CONTENT
          ========================================== */}

          <div className="space-y-6">
            {/* =========================================
                PROFILE
            ========================================== */}

            <section
              id="profile"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Profile
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Your personal account information.
                </p>
              </div>

              <div className="p-5">
                {/* PROFILE PHOTO */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/15 text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {settings.profileName
                      ? settings.profileName.charAt(0).toUpperCase()
                      : "A"}
                  </div>

                  <div>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      <FiCamera size={15} />
                      Change Photo
                    </button>

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      JPG or PNG. Recommended square image.
                    </p>
                  </div>
                </div>

                {/* PROFILE INPUTS */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Full Name</label>

                    <input
                      type="text"
                      name="profileName"
                      value={settings.profileName}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Role</label>

                    <input
                      type="text"
                      name="profileRole"
                      value={settings.profileRole}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>

                    <input
                      type="email"
                      name="profileEmail"
                      value={settings.profileEmail}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Phone Number</label>

                    <input
                      type="text"
                      name="profilePhone"
                      value={settings.profilePhone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================
                BUSINESS
            ========================================== */}

            <section
              id="business"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Business Information
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Information used on invoices, estimates and reports.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Business Name</label>

                  <input
                    type="text"
                    name="businessName"
                    value={settings.businessName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Owner Name</label>

                  <input
                    type="text"
                    name="ownerName"
                    value={settings.ownerName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Business Phone</label>

                  <input
                    type="text"
                    name="businessPhone"
                    value={settings.businessPhone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Business Email</label>

                  <input
                    type="email"
                    name="businessEmail"
                    value={settings.businessEmail}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Address</label>

                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows="3"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className={labelClass}>PAN / VAT Number</label>

                  <input
                    type="text"
                    name="panVat"
                    value={settings.panVat}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* =========================================
                INVOICE & ESTIMATE
            ========================================== */}

            <section
              id="invoice"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Invoice & Estimate
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Control invoice and estimate numbering.
                </p>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Invoice Prefix</label>

                    <input
                      type="text"
                      name="invoicePrefix"
                      value={settings.invoicePrefix}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Estimate Prefix</label>

                    <input
                      type="text"
                      name="estimatePrefix"
                      value={settings.estimatePrefix}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Currency</label>

                    <select
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="NPR">NPR</option>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>

                {/* INVOICE OPTIONS */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Enable Tax / VAT
                    </span>

                    <input
                      type="checkbox"
                      name="taxEnabled"
                      checked={settings.taxEnabled}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Show Logo on Invoice
                    </span>

                    <input
                      type="checkbox"
                      name="showLogo"
                      checked={settings.showLogo}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Show Customer PAN
                    </span>

                    <input
                      type="checkbox"
                      name="showCustomerPan"
                      checked={settings.showCustomerPan}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Show Signature
                    </span>

                    <input
                      type="checkbox"
                      name="showSignature"
                      checked={settings.showSignature}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>
                </div>

                {/* TAX RATE */}

                {settings.taxEnabled && (
                  <div className="max-w-xs">
                    <label className={labelClass}>Tax Rate (%)</label>

                    <input
                      type="number"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* =========================================
                PAYMENT
            ========================================== */}

            <section
              id="payment"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Payment Settings
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Configure payment and due reminders.
                </p>
              </div>

              <div className="space-y-4 p-5">
                {/* PAYMENT METHOD */}

                <div className="max-w-sm">
                  <label className={labelClass}>Default Payment Method</label>

                  <select
                    name="defaultPaymentMethod"
                    value={settings.defaultPaymentMethod}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                    <option>eSewa</option>
                    <option>Khalti</option>
                    <option>Card</option>
                    <option>Cheque</option>
                  </select>
                </div>

                {/* PARTIAL PAYMENT */}

                <label className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Allow Partial Payments
                    </p>

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Customer can pay the bill in multiple installments.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="partialPayment"
                    checked={settings.partialPayment}
                    onChange={handleChange}
                    className="h-4 w-4 accent-orange-500"
                  />
                </label>

                {/* PAYMENT REMINDER */}

                <label className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Payment Due Reminder
                    </p>

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Show reminder for upcoming payments.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="dueReminder"
                    checked={settings.dueReminder}
                    onChange={handleChange}
                    className="h-4 w-4 accent-orange-500"
                  />
                </label>

                {/* REMINDER DAYS */}

                {settings.dueReminder && (
                  <div className="max-w-xs">
                    <label className={labelClass}>
                      Reminder Before Due (Days)
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="reminderDays"
                      value={settings.reminderDays}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* =========================================
                NOTIFICATIONS
            ========================================== */}

            <section
              id="notification"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Notification Settings
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Choose which events should create notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                {[
                  ["newProject", "New Project"],
                  ["paymentReceived", "Payment Received"],
                  ["paymentDue", "Payment Due"],
                  ["projectCompleted", "Project Completed"],
                  ["lowStock", "Low Stock Alert"],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {label}
                    </span>

                    <input
                      type="checkbox"
                      name={name}
                      checked={settings[name]}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* =========================================
                PRINTING
            ========================================== */}

            <section
              id="printing"
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors"
            >
              <div className="border-b border-slate-200 dark:border-slate-700 px-5 py-4">
                <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                  Printing Defaults
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Set defaults for new printing projects.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                {/* PRIORITY */}

                <div>
                  <label className={labelClass}>Default Priority</label>

                  <select
                    name="defaultPriority"
                    value={settings.defaultPriority}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                {/* PROJECT STATUS */}

                <div>
                  <label className={labelClass}>Default Project Status</label>

                  <select
                    name="defaultProjectStatus"
                    value={settings.defaultProjectStatus}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                {/* WORK TYPE */}

                <div>
                  <label className={labelClass}>Default Work Type</label>

                  <select
                    name="defaultWorkType"
                    value={settings.defaultWorkType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option>Digital Printing</option>
                    <option>Offset Printing</option>
                    <option>Flex Printing</option>
                    <option>Business Cards</option>
                    <option>Brochure</option>
                    <option>Wedding Cards</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioSettings;
