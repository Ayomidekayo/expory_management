
import { Loader2, History } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

import { Badge } from "../../ui/badge";
import { useTransportPayments } from "../../../hooks/transport/useTransportPayment";
import type { TransportItem } from "../../../types/transport";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TransportItem | null;
}

const symbols: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  CFA: "CFA ",
};

const money = (value: number | string, currency: string) =>
  `${symbols[currency] ?? ""}${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const date = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function TransportPaymentHistoryDialog({
  open,
  onOpenChange,
  item,
}: Props) {
  const isEnabled = open && item !== null;

  const {
    data,
    isLoading,
    isError,
  } = useTransportPayments(
    item?.id ?? "",
    isEnabled
  );

  const payments = data?.payments ?? [];
  const summary = data?.summary;

  const currency =
    summary?.currency ?? item?.chargeCurrency ?? "NGN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[calc(100%-1rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Payment History
          </DialogTitle>

          <DialogDescription>
            {item?.name || item?.ownerName || "Transport item"} —
            payment records and outstanding balance.
          </DialogDescription>
        </DialogHeader>

        {!item ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Select a transport item to view its payment history.
          </p>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="py-8 text-center text-sm text-red-600">
            Unable to load payment history. Please try again.
          </p>
        ) : (
          <div className="space-y-5">
            {/* PAYMENT SUMMARY */}
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Charge
                </p>
                <p className="break-words font-semibold">
                  {money(
                    summary?.chargeAmount ?? item.chargeAmount,
                    currency
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Paid
                </p>
                <p className="break-words font-semibold text-green-700">
                  {money(summary?.totalPaid ?? 0, currency)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Outstanding
                </p>
                <p className="break-words font-semibold text-amber-700">
                  {money(summary?.balance ?? 0, currency)}
                </p>
              </div>
            </div>

            {/* PAYMENT HISTORY */}
            {payments.length === 0 ? (
              <div className="rounded-lg border border-dashed py-10 text-center">
                <History className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />

                <p className="font-medium">
                  No payment records yet
                </p>

                <p className="text-sm text-muted-foreground">
                  Payments recorded for this item will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[650px] text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Reference</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-t">
                        <td className="whitespace-nowrap p-3">
                          {date(payment.paymentDate)}
                        </td>

                        <td className="p-3">
                          <Badge variant="outline">
                            {payment.paymentType === "ADVANCE"
                              ? "Advance"
                              : "Regular"}
                          </Badge>
                        </td>

                        <td className="whitespace-nowrap p-3 font-semibold text-green-700">
                          {money(payment.amount, currency)}
                        </td>

                        <td className="p-3">
                          {payment.paymentMethod || "-"}
                        </td>

                        <td className="p-3">
                          {payment.reference || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
