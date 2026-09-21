import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CreditCard,
  X,
} from "lucide-react";

import { toast } from "react-hot-toast";

import type { Invoice } from "../../../types/invoice";

import {
  useCreateInvoicePayment,
} from "../../../hooks/invoices/useInvoicePayments";

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

export default function RecordPaymentDialog({
  invoice,
  onClose,
}: Props) {
  const createPayment =
    useCreateInvoicePayment();

  const items = invoice.items ?? [];

  const [amount, setAmount] =
    useState("");

  const [invoiceItemId, setInvoiceItemId] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const outstandingBalance = useMemo(() => {
    return Number(invoice.totalAmount) || 0;
  }, [invoice.totalAmount]);

  useEffect(() => {
    if (items.length === 0) {
      setInvoiceItemId("");
    }
  }, [items.length]);

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const numericAmount =
      Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      toast.error(
        "Enter a valid payment amount."
      );
      return;
    }

    createPayment.mutate(
      {
        invoiceId: invoice.id,

        invoiceItemId:
          invoiceItemId || undefined,

        amount: numericAmount,

        description:
          description.trim() || undefined,

        paymentDate,

        paymentMethod:
          paymentMethod || undefined,

        reference:
          reference.trim() || undefined,

        notes:
          notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            "Payment recorded successfully."
          );

          onClose();
        },

        onError: (
          error: any
        ) => {
          toast.error(
            error?.response?.data?.message ||
              "Unable to record payment."
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CreditCard size={21} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Record Payment
              </h2>

              <p className="text-sm text-slate-500">
                Record a payment received for this invoice.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto"
        >
          <div className="space-y-5 p-6">
            {/* BALANCE */}

            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                Invoice Total
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-900">
                {formatMoney(
                  invoice.totalAmount,
                  invoice.currency
                )}
              </p>
            </div>

            {/* AMOUNT */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Amount Paid
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="Enter amount paid"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                required
              />
            </div>

            {/* ITEM */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                What is this payment for?
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <select
                value={invoiceItemId}
                onChange={(event) =>
                  setInvoiceItemId(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                <option value="">
                  General Invoice Payment
                </option>

                {items.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.description}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment Description
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <input
                type="text"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="e.g. Customs duty payment"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* DATE + METHOD */}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payment Date
                  <span className="text-red-500">
                    {" "}*
                  </span>
                </label>

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(event) =>
                    setPaymentDate(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payment Method
                </label>

                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">
                    Select method
                  </option>

                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>

                  <option value="CASH">
                    Cash
                  </option>

                  <option value="CARD">
                    Card
                  </option>

                  <option value="CHEQUE">
                    Cheque
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>
            </div>

            {/* REFERENCE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment Reference
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <input
                type="text"
                value={reference}
                onChange={(event) =>
                  setReference(
                    event.target.value
                  )
                }
                placeholder="Transaction/reference number"
                className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            {/* NOTES */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
                <span className="ml-1 text-xs font-normal text-slate-400">
                  Optional
                </span>
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(
                    event.target.value
                  )
                }
                rows={3}
                placeholder="Additional payment notes..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          {/* FOOTER */}

          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={
                createPayment.isPending
              }
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                createPayment.isPending
              }
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createPayment.isPending
                ? "Recording..."
                : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatMoney(
  value: number | string,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  ).format(Number(value) || 0);
}