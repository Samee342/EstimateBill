import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { createInvoice } from "../api/payment";

const toNumber = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const formatMoney = (amount) =>
  `Rs. ${toNumber(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const RecordPaymentModal = ({ isOpen, onClose, customer, onSaved }) => {
  // Only orders with a balance > 0 can receive a payment
  const payableOrders = useMemo(() => {
    if (!customer) return [];
    return customer.orders.filter((o) => toNumber(o.balance) > 0);
  }, [customer]);

  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [status, setStatus] = useState("partial");
  const [paidDate, setPaidDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [saving, setSaving] = useState(false);

  const selectedOrder = payableOrders.find(
    (o) => String(o.id) === String(orderId),
  );

  const maxAmount = selectedOrder ? toNumber(selectedOrder.balance) : 0;

  // Reset every time the modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (payableOrders.length > 0) {
      setOrderId(payableOrders[0].id);
      setAmount(String(toNumber(payableOrders[0].balance)));
    } else {
      setOrderId("");
      setAmount("");
    }

    setMethod("cash");
    setStatus("partial");
    setPaidDate(new Date().toISOString().split("T")[0]);
    setSaving(false);
  }, [isOpen, payableOrders]);

  // When the order changes, default the amount to the full remaining balance
  useEffect(() => {
    if (selectedOrder) {
      setAmount(String(toNumber(selectedOrder.balance)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (!isOpen || !customer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrder) {
      toast.error("Please select an order.");
      return;
    }

    const numeric = toNumber(amount);

    if (numeric <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    if (numeric > maxAmount + 0.001) {
      toast.error(
        `Amount cannot exceed the due amount (${formatMoney(maxAmount)}).`,
      );
      return;
    }

    // If they paid the full remaining balance, mark it paid.
    // Otherwise mark partial.
    const finalStatus = numeric >= maxAmount - 0.001 ? "paid" : status;

    const payload = {
      order: selectedOrder.id,
      amount: numeric,
      status: finalStatus,
      payment_method: method,
      paid_date: paidDate || null,
    };

    try {
      setSaving(true);

      await createInvoice(payload);

      toast.success("Payment recorded successfully.");
      onSaved?.();
      onClose?.();
    } catch (error) {
      console.error("Create invoice failed:", error?.response?.data);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.amount?.[0] ||
        error?.response?.data?.order?.[0] ||
        "Failed to record payment.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Record Payment
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {customer.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
          >
            <FiX size={18} />
          </button>
        </div>

        {payableOrders.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This customer has no outstanding balance.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
            {/* ORDER */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Order / Slip
              </label>
              <select
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              >
                {payableOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    #{o.slip_no ?? "-"} — {o.project_name || "Order"} — Due{" "}
                    {formatMoney(o.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* DUE AMOUNT + AMOUNT RECEIVED */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* DUE AMOUNT (read-only) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Due Amount
                </label>
                <input
                  type="text"
                  value={formatMoney(maxAmount)}
                  readOnly
                  tabIndex={-1}
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-orange-600 outline-none dark:border-slate-600 dark:bg-slate-700/60 dark:text-orange-400"
                />
              </div>

              {/* AMOUNT RECEIVED (editable) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Amount Received
                </label>
                <input
                  type="number"
                  min="0"
                  max={maxAmount}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* METHOD */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="esewa">eSewa</option>
                  <option value="khalti">Khalti</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* STATUS (auto-selected, editable) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              >
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecordPaymentModal;
