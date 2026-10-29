import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPrinter, FiPhone, FiMapPin } from "react-icons/fi";

const InvoiceDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const invoiceNumber = searchParams.get("invoice") || "INV-2026-00033";

  // ==========================================
  // DEMO INVOICE DATA
  // ==========================================

  const invoice = {
    invoiceNumber,
    date: "22 Sep 2026",
    dueDate: "30 Sep 2026",

    business: {
      name: "PrintTech Printing Press",
      address: "Butwal, Rupandehi, Nepal",
      phone: "9845000000",
      email: "info@printtech.com",
      pan: "123456789",
    },

    customer: {
      name: "Ram Sharma",
      phone: "9845123456",
      address: "Butwal, Rupandehi",
      pan: "609876543",
    },

    items: [
      {
        description: "Business Card",
        quantity: 500,
        rate: 5,
      },
      {
        description: "A4 Color Brochure",
        quantity: 200,
        rate: 25,
      },
      {
        description: "Wedding Invitation Card",
        quantity: 100,
        rate: 35,
      },
    ],

    discount: 500,
    taxRate: 13,
    paid: 5000,

    paymentMethod: "Cash",
  };

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const subtotal = invoice.items.reduce(
    (total, item) => total + item.quantity * item.rate,
    0,
  );

  const taxableAmount = subtotal - invoice.discount;

  const taxAmount = (taxableAmount * invoice.taxRate) / 100;

  const grandTotal = taxableAmount + taxAmount;

  const dueAmount = Math.max(grandTotal - invoice.paid, 0);

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return `Rs. ${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* ==================================================
          SCREEN ACTION BAR
      ================================================== */}

      <div className="print:hidden max-w-5xl mx-auto mb-5 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
        >
          <FiArrowLeft size={17} />
          Back
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
        >
          <FiPrinter size={17} />
          Print Invoice
        </button>
      </div>

      {/* ==================================================
          SCREEN INVOICE
      ================================================== */}

      <div className="screen-invoice max-w-5xl mx-auto bg-white shadow-sm border border-slate-200">
        {/* SCREEN HEADER */}

        <div className="px-8 md:px-10 pt-8 pb-7 border-b-2 border-orange-500">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {invoice.business.name}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Printing • Designing • Digital Services
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FiMapPin size={15} />
                  {invoice.business.address}
                </div>

                <div className="flex items-center gap-2">
                  <FiPhone size={15} />
                  {invoice.business.phone}
                </div>

                <p>Email: {invoice.business.email}</p>

                <p>PAN/VAT No: {invoice.business.pan}</p>
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
                Invoice
              </p>

              <h2 className="text-2xl font-bold text-orange-500 mt-1">
                {invoice.invoiceNumber}
              </h2>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex md:justify-end gap-4">
                  <span className="text-slate-500">Invoice Date</span>

                  <span className="font-medium text-slate-800">
                    {invoice.date}
                  </span>
                </div>

                <div className="flex md:justify-end gap-4">
                  <span className="text-slate-500">Due Date</span>

                  <span className="font-medium text-slate-800">
                    {invoice.dueDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCREEN CUSTOMER */}

        <div className="px-8 md:px-10 py-6 border-b border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Bill To
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {invoice.customer.name}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {invoice.customer.address}
              </p>
            </div>

            <div className="md:text-right text-sm text-slate-500">
              <p>
                Phone:{" "}
                <span className="text-slate-800">{invoice.customer.phone}</span>
              </p>

              <p className="mt-1">
                PAN/VAT:{" "}
                <span className="text-slate-800">{invoice.customer.pan}</span>
              </p>
            </div>
          </div>
        </div>

        {/* SCREEN ITEMS */}

        <div className="px-8 md:px-10 py-7">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  S.N.
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>

                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quantity
                </th>

                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Rate
                </th>

                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item, index) => {
                const amount = item.quantity * item.rate;

                return (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-slate-800">
                      {item.description}
                    </td>

                    <td className="px-4 py-4 text-sm text-center text-slate-600">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-4 text-sm text-right text-slate-600">
                      {formatMoney(item.rate)}
                    </td>

                    <td className="px-4 py-4 text-sm text-right font-medium text-slate-800">
                      {formatMoney(amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SCREEN SUMMARY */}

        <div className="px-8 md:px-10 pb-8">
          <div className="flex justify-end">
            <div className="w-full md:w-96">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-slate-500">Subtotal</span>

                <span className="font-medium text-slate-800">
                  {formatMoney(subtotal)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm">
                <span className="text-slate-500">Discount</span>

                <span className="font-medium text-slate-800">
                  - {formatMoney(invoice.discount)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm">
                <span className="text-slate-500">Taxable Amount</span>

                <span className="font-medium text-slate-800">
                  {formatMoney(taxableAmount)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm">
                <span className="text-slate-500">VAT ({invoice.taxRate}%)</span>

                <span className="font-medium text-slate-800">
                  {formatMoney(taxAmount)}
                </span>
              </div>

              <div className="border-t-2 border-slate-800 mt-3 pt-4 flex justify-between items-center">
                <span className="font-bold text-slate-900">Grand Total</span>

                <span className="text-xl font-bold text-orange-500">
                  {formatMoney(grandTotal)}
                </span>
              </div>

              <div className="flex justify-between py-3 text-sm">
                <span className="text-slate-500">Paid Amount</span>

                <span className="font-medium text-green-600">
                  {formatMoney(invoice.paid)}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-lg flex justify-between">
                <span className="font-semibold text-slate-700">
                  Balance Due
                </span>

                <span className="font-bold text-red-500">
                  {formatMoney(dueAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SCREEN PAYMENT */}

        <div className="mx-8 md:mx-10 mb-8 border border-slate-200 rounded-lg px-5 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Payment Method
              </p>

              <p className="text-sm font-medium text-slate-800 mt-1">
                {invoice.paymentMethod}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Payment Status
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  dueAmount === 0
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {dueAmount === 0 ? "PAID" : "PARTIALLY PAID"}
              </span>
            </div>
          </div>
        </div>

        {/* SCREEN FOOTER */}

        <div className="border-t border-slate-200 px-8 md:px-10 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Terms & Conditions
              </p>

              <p className="text-xs text-slate-500 mt-2 max-w-md leading-5">
                Please check the invoice details before making payment. Printed
                work and custom orders are subject to the agreed specifications.
              </p>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-slate-500">Thank you for choosing</p>

              <p className="text-base font-bold text-slate-900 mt-1">
                PrintTech Printing Press
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          PRINT INVOICE
          COMPLETELY SEPARATE FROM SCREEN INVOICE
      ================================================== */}

      <div className="print-invoice">
        {/* PRINT HEADER */}

        <div className="print-header">
          <h1>INVOICE / BILL</h1>

          <div className="print-meta">
            <span>Invoice No: {invoice.invoiceNumber}</span>

            <span>Date: {invoice.date}</span>
          </div>
        </div>

        {/* PRINT CUSTOMER */}

        <div className="print-customer">
          <div>
            <strong>BILL TO</strong>

            <p>{invoice.customer.name}</p>

            <small>{invoice.customer.address}</small>
          </div>

          <div className="print-customer-right">
            <p>Phone: {invoice.customer.phone}</p>

            <p>PAN/VAT: {invoice.customer.pan}</p>
          </div>
        </div>

        {/* PRINT ITEMS */}

        <table className="print-table">
          <thead>
            <tr>
              <th className="sn">S.N.</th>

              <th>Description</th>

              <th className="qty">Quantity</th>

              <th className="rate">Rate</th>

              <th className="amount">Amount</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, index) => {
              const amount = item.quantity * item.rate;

              return (
                <tr key={index}>
                  <td className="sn">{index + 1}</td>

                  <td>{item.description}</td>

                  <td className="qty">{item.quantity}</td>

                  <td className="rate">{formatMoney(item.rate)}</td>

                  <td className="amount">{formatMoney(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PRINT TOTALS */}

        <div className="print-totals">
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>

          <div className="total-row">
            <span>Discount</span>
            <span>- {formatMoney(invoice.discount)}</span>
          </div>

          <div className="total-row">
            <span>VAT ({invoice.taxRate}%)</span>
            <span>{formatMoney(taxAmount)}</span>
          </div>

          <div className="total-row grand-total">
            <span>Grand Total</span>
            <span>{formatMoney(grandTotal)}</span>
          </div>

          <div className="total-row">
            <span>Paid</span>
            <span>{formatMoney(invoice.paid)}</span>
          </div>

          <div className="total-row balance">
            <span>Balance Due</span>
            <span>{formatMoney(dueAmount)}</span>
          </div>
        </div>
      </div>

      {/* ==================================================
          PRINT CSS
      ================================================== */}

      <style>
        {`

          /* ==========================================
             PRINT VERSION HIDDEN ON SCREEN
          ========================================== */

          .print-invoice {
            display: none;
          }


          /* ==========================================
             PRINT
          ========================================== */

          @media print {

            @page {
              size: A4;
              margin: 8mm;
            }


            html,
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              min-height: 0 !important;
              background: white !important;
            }


            /* ------------------------------------------
               HIDE EVERYTHING SCREEN RELATED
            ------------------------------------------ */

            body * {
              visibility: hidden !important;
            }

            .print-invoice,
            .print-invoice * {
              visibility: visible !important;
            }


            /* ------------------------------------------
               PRINT CONTAINER
            ------------------------------------------ */

            .print-invoice {
              display: block !important;

              position: absolute !important;

              left: 0 !important;
              top: 0 !important;

              width: 100% !important;

              margin: 0 !important;
              padding: 0 !important;

              background: white !important;

              color: #000 !important;
            }


            /* ------------------------------------------
               BLACK & WHITE ONLY
            ------------------------------------------ */

            .print-invoice,
            .print-invoice * {
              color: #000000 !important;
              background: transparent !important;

              box-shadow: none !important;
              text-shadow: none !important;

              -webkit-print-color-adjust: economy !important;
              print-color-adjust: economy !important;
            }


            /* ------------------------------------------
               HEADER
            ------------------------------------------ */

            .print-header {
              display: block !important;

              text-align: center !important;

              margin: 0 0 10px 0 !important;
              padding: 0 0 8px 0 !important;

              border-bottom: 1.5px solid #000 !important;
            }

            .print-header h1 {
              margin: 0 !important;

              font-size: 20px !important;
              line-height: 1.2 !important;

              font-weight: 700 !important;
            }

            .print-meta {
              display: flex !important;

              justify-content: center !important;
              gap: 30px !important;

              margin-top: 4px !important;

              font-size: 10px !important;
            }


            /* ------------------------------------------
               CUSTOMER
            ------------------------------------------ */

            .print-customer {
              display: flex !important;

              justify-content: space-between !important;
              align-items: flex-start !important;

              width: 100% !important;

              margin: 0 0 10px 0 !important;
              padding: 0 0 7px 0 !important;

              border-bottom: 1px solid #000 !important;
            }

            .print-customer strong {
              display: block !important;

              margin-bottom: 2px !important;

              font-size: 9px !important;
              font-weight: 700 !important;
            }

            .print-customer p {
              margin: 0 !important;

              font-size: 11px !important;
              font-weight: 600 !important;
            }

            .print-customer small {
              display: block !important;

              margin-top: 2px !important;

              font-size: 9px !important;
            }

            .print-customer-right {
              text-align: right !important;

              font-size: 9px !important;

              line-height: 1.5 !important;
            }

            .print-customer-right p {
              margin: 0 !important;

              font-size: 9px !important;
              font-weight: 400 !important;
            }


            /* ------------------------------------------
               TABLE
            ------------------------------------------ */

            .print-table {
              width: 100% !important;

              margin: 0 !important;

              border-collapse: collapse !important;

              table-layout: fixed !important;
            }

            .print-table thead {
              display: table-header-group !important;
            }

            .print-table tbody {
              display: table-row-group !important;
            }

            .print-table tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .print-table th,
            .print-table td {
              border: 1px solid #000 !important;

              color: #000 !important;
              background: white !important;

              padding: 5px 6px !important;

              font-size: 9px !important;

              line-height: 1.2 !important;
            }

            .print-table th {
              font-weight: 700 !important;
            }

            .print-table .sn {
              width: 8% !important;
              text-align: center !important;
            }

            .print-table .qty {
              width: 14% !important;
              text-align: center !important;
            }

            .print-table .rate {
              width: 17% !important;
              text-align: right !important;
            }

            .print-table .amount {
              width: 20% !important;
              text-align: right !important;
            }


            /* ------------------------------------------
               TOTALS
            ------------------------------------------ */

            .print-totals {
              width: 260px !important;

              margin: 10px 0 0 auto !important;

              padding: 0 !important;
            }

            .total-row {
              display: flex !important;

              justify-content: space-between !important;
              align-items: center !important;

              padding: 3px 0 !important;

              margin: 0 !important;

              font-size: 10px !important;

              line-height: 1.25 !important;

              color: #000 !important;
            }

            .grand-total {
              margin-top: 4px !important;

              padding: 5px 0 !important;

              border-top: 1.5px solid #000 !important;

              font-size: 12px !important;

              font-weight: 700 !important;
            }

            .grand-total span:last-child {
              font-size: 12px !important;

              font-weight: 700 !important;
            }

            .balance {
              margin-top: 3px !important;

              padding: 5px 6px !important;

              border: 1px solid #000 !important;

              font-weight: 700 !important;
            }


            /* ------------------------------------------
               PREVENT PAGE BREAK
            ------------------------------------------ */

            .print-header,
            .print-customer,
            .print-table,
            .print-totals {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            .print-invoice {
              break-after: avoid !important;
              page-break-after: avoid !important;
            }

          }
        `}
      </style>
    </div>
  );
};

export default InvoiceDetails;
