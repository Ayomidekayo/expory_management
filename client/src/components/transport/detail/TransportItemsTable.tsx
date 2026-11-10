
import {
  CalendarDays,
  Truck,
  Container,
  UserRound,
  Wallet,
  CreditCard,
  History,
  Pencil,
  Lock,
  Unlock,
  MessageSquare,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

import type {
  TransportItem,
  Currency,
  PaymentStatus,
} from "../../../types/transport";

interface Props {
  items: TransportItem[];
  lockedColumns?: string[];
  parentLocked?: boolean;
  onEditItem: (item: TransportItem) => void;
  onEditCharge: (item: TransportItem) => void;
  onAddPayment: (item: TransportItem) => void;
  onViewPayments: (item: TransportItem) => void;
  onToggleLock: (item: TransportItem) => void;
}

const currencySymbols: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  CFA: "CFA ",
};

const formatMoney = (
  amount: number | string | null | undefined,
  currency: Currency,
) => {
  const value = Number(amount ?? 0);

  return `${currencySymbols[currency]}${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value?: string) => {
  if (!value) return "-";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTotalPaid = (item: TransportItem) =>
  (item.payments ?? []).reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

const getPaymentStatusLabel = (status: PaymentStatus) => {
  const labels: Record<PaymentStatus, string> = {
    UNPAID: "Unpaid",
    ADVANCE: "Advance",
    PARTIALLY_PAID: "Partially Paid",
    PAID: "Paid",
  };

  return labels[status];
};

const getPaymentStatusClass = (status: PaymentStatus) => {
  const classes: Record<PaymentStatus, string> = {
    UNPAID: "bg-slate-100 text-slate-700 border-slate-200",
    ADVANCE: "bg-amber-50 text-amber-700 border-amber-200",
    PARTIALLY_PAID: "bg-blue-50 text-blue-700 border-blue-200",
    PAID: "bg-green-50 text-green-700 border-green-200",
  };

  return classes[status];
};

interface ItemActionsProps {
  item: TransportItem;
  balance: number;
  charge: number;
  hasPayments: boolean;
  parentLocked: boolean;
  chargeLocked: boolean;
  onEditItem: (item: TransportItem) => void;
  onEditCharge: (item: TransportItem) => void;
  onAddPayment: (item: TransportItem) => void;
  onViewPayments: (item: TransportItem) => void;
  onToggleLock: (item: TransportItem) => void;
}

function ItemActions({
  item,
  balance,
  charge,
  hasPayments,
  parentLocked,
  chargeLocked,
  onEditItem,
  onEditCharge,
  onAddPayment,
  onViewPayments,
  onToggleLock,
}: ItemActionsProps) {
  const buttonClass =
    "h-9 w-full justify-center gap-1.5 px-2 text-xs sm:text-sm";

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={`${buttonClass} border-slate-200 text-slate-700 hover:bg-slate-100`}
        disabled={parentLocked || item.isLocked}
        onClick={() => onEditItem(item)}
      >
        <Pencil className="h-3.5 w-3.5 shrink-0" />
        Edit Item
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className={`${buttonClass} border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100`}
        disabled={parentLocked || item.isLocked || chargeLocked}
        onClick={() => onEditCharge(item)}
      >
        <Wallet className="h-3.5 w-3.5 shrink-0" />
        Edit Charge
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className={`${buttonClass} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
        disabled={
          parentLocked ||
          item.isLocked ||
          balance <= 0 ||
          charge <= 0
        }
        onClick={() => onAddPayment(item)}
      >
        <CreditCard className="h-3.5 w-3.5 shrink-0" />
        Add Payment
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className={`${buttonClass} border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100`}
        disabled={!hasPayments}
        onClick={() => onViewPayments(item)}
      >
        <History className="h-3.5 w-3.5 shrink-0" />
        Payment History
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className={`${buttonClass} sm:w-auto ${
          item.isLocked
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-slate-200 text-slate-600 hover:bg-slate-100"
        }`}
        disabled={parentLocked}
        onClick={() => onToggleLock(item)}
      >
        {item.isLocked ? (
          <>
            <Unlock className="h-3.5 w-3.5 shrink-0" />
            Unlock Item
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5 shrink-0" />
            Lock Item
          </>
        )}
      </Button>
    </div>
  );
}

export default function TransportItemsTable({
  items,
  lockedColumns = [],
  parentLocked = false,
  onEditItem,
  onEditCharge,
  onAddPayment,
  onViewPayments,
  onToggleLock,
}: Props) {
  const isColumnLocked = (key: string) =>
    lockedColumns.includes(key);

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5">
              <Truck className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold sm:text-lg">
                Transport Items
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Manage items, charges and payments
              </p>
            </div>
          </div>

          <Badge variant="secondary" className="shrink-0">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </Badge>
        </div>

        {parentLocked && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 sm:text-sm">
            <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              This transport is locked. Item editing, payments and
              lock changes are disabled.
            </p>
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 ? (
        <div className="px-4 py-14 text-center sm:py-16">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Truck className="h-6 w-6 text-slate-400" />
          </div>

          <h3 className="font-semibold text-slate-900">
            No transport items
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Items added to this transport will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE AND TABLET CARD VIEW */}
          <div className="space-y-3 bg-slate-50/60 p-3 md:hidden sm:p-4">
            {items.map((item, index) => {
              const totalPaid = getTotalPaid(item);
              const charge = Number(item.chargeAmount ?? 0);
              const balance = Math.max(charge - totalPaid, 0);
              const hasPayments = (item.payments ?? []).length > 0;

              const vehicleDetails =
                item.itemType === "TRUCK"
                  ? [item.frontPlateNumber, item.backPlateNumber]
                      .filter(Boolean)
                      .join(" / ")
                  : [item.containerName, item.containerNumber]
                      .filter(Boolean)
                      .join(" / ");

              return (
                <article
                  key={item.id}
                  className="min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  {/* ITEM HEADER */}
                  <div className="flex items-start justify-between gap-3 border-b p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-lg bg-slate-100 p-2">
                        {item.itemType === "TRUCK" ? (
                          <Truck className="h-5 w-5 text-slate-700" />
                        ) : (
                          <Container className="h-5 w-5 text-slate-700" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-slate-900">
                          {item.name || `${item.itemType} ${index + 1}`}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(item.itemDate)}
                          </span>

                          <span>•</span>

                          <Badge variant="outline" className="text-[10px]">
                            {item.itemType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {item.isLocked && (
                      <Badge className="shrink-0 bg-amber-100 text-amber-800 hover:bg-amber-100">
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    )}
                  </div>

                  {/* ITEM DETAILS */}
                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Owner
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 break-words text-sm font-medium">
                          <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          {item.ownerName}
                          {isColumnLocked("ownerName") && (
                            <Lock className="h-3 w-3 shrink-0 text-amber-600" />
                          )}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Vehicle / Container
                        </p>
                        <p className="mt-1 break-words text-sm font-medium">
                          {vehicleDetails || "-"}
                        </p>
                      </div>
                    </div>

                    {item.remarks && (
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Remarks
                        </p>
                        <p className="break-words text-sm text-slate-700">
                          {item.remarks}
                        </p>
                      </div>
                    )}

                    {/* FINANCIAL SUMMARY */}
                    <div className="grid grid-cols-3 gap-2 rounded-lg border bg-slate-50/70 p-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                          Charge
                        </p>
                        {isColumnLocked("chargeAmount") && (
                          <Lock className="mr-1 inline h-3 w-3 text-amber-600" />
                        )}
                        <p className="mt-1 break-all text-xs font-semibold text-slate-900 sm:text-sm">
                          {formatMoney(item.chargeAmount, item.chargeCurrency)}
                        </p>
                      </div>

                      <div className="min-w-0 border-x px-2">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                          Paid
                        </p>
                        <p className="mt-1 break-all text-xs font-semibold text-emerald-700 sm:text-sm">
                          {formatMoney(totalPaid, item.chargeCurrency)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                          Balance
                        </p>
                        <p
                          className={`mt-1 break-all text-xs font-semibold sm:text-sm ${
                            balance > 0
                              ? "text-amber-700"
                              : "text-emerald-700"
                          }`}
                        >
                          {formatMoney(balance, item.chargeCurrency)}
                        </p>
                      </div>
                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        Payment status
                      </span>

                      <Badge
                        variant="outline"
                        className={getPaymentStatusClass(item.paymentStatus)}
                      >
                        {getPaymentStatusLabel(item.paymentStatus)}
                      </Badge>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="border-t bg-white p-3 sm:p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Item Actions
                    </p>

                    <ItemActions
                      item={item}
                      balance={balance}
                      charge={charge}
                      hasPayments={hasPayments}
                      parentLocked={parentLocked}
                      chargeLocked={
                        isColumnLocked("chargeAmount") ||
                        isColumnLocked("chargeCurrency")
                      }
                      onEditItem={onEditItem}
                      onEditCharge={onEditCharge}
                      onAddPayment={onAddPayment}
                      onViewPayments={onViewPayments}
                      onToggleLock={onToggleLock}
                    />
                  </div>
                </article>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden w-full md:block">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1250px]">
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Item / Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Vehicle / Container</TableHead>
                    <TableHead className="text-right">Charge</TableHead>
                    <TableHead className="text-right">Amount Paid</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="min-w-[390px] text-right">
                      Manage Item
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((item, index) => {
                    const totalPaid = getTotalPaid(item);
                    const charge = Number(item.chargeAmount ?? 0);
                    const balance = Math.max(charge - totalPaid, 0);
                    const hasPayments = (item.payments ?? []).length > 0;

                    const vehicleDetails =
                      item.itemType === "TRUCK"
                        ? [item.frontPlateNumber, item.backPlateNumber]
                            .filter(Boolean)
                            .join(" / ")
                        : [item.containerName, item.containerNumber]
                            .filter(Boolean)
                            .join(" / ");

                    return (
                      <TableRow
                        key={item.id}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <TableCell>
                          <Badge variant="outline">{index + 1}</Badge>
                        </TableCell>

                        <TableCell className="min-w-[150px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-medium text-slate-900">
                              {item.name || `Transport Item ${index + 1}`}
                              {item.isLocked && (
                                <Lock className="h-3.5 w-3.5 text-amber-600" />
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(item.itemDate)}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {item.itemType === "TRUCK" ? (
                              <Truck className="h-3 w-3" />
                            ) : (
                              <Container className="h-3 w-3" />
                            )}
                            {item.itemType}
                          </Badge>
                        </TableCell>

                        <TableCell className="min-w-[130px]">
                          <div className="flex items-center gap-1.5">
                            <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.ownerName}
                            {isColumnLocked("ownerName") && (
                              <Lock className="h-3 w-3 text-amber-600" />
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="min-w-[160px]">
                          {vehicleDetails || "-"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-right font-medium">
                          {isColumnLocked("chargeAmount") && (
                            <Lock className="mr-1 inline h-3 w-3 text-amber-600" />
                          )}
                          {formatMoney(item.chargeAmount, item.chargeCurrency)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-right text-green-700">
                          {formatMoney(totalPaid, item.chargeCurrency)}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-right font-semibold">
                          <span
                            className={
                              balance > 0
                                ? "text-amber-700"
                                : "text-green-700"
                            }
                          >
                            {formatMoney(balance, item.chargeCurrency)}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getPaymentStatusClass(item.paymentStatus)}
                          >
                            {getPaymentStatusLabel(item.paymentStatus)}
                          </Badge>
                        </TableCell>

                        <TableCell className="max-w-[180px]">
                          {item.remarks ? (
                            <div className="flex items-start gap-1.5 text-sm text-slate-600">
                              <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              <span className="line-clamp-2">
                                {item.remarks}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <ItemActions
                            item={item}
                            balance={balance}
                            charge={charge}
                            hasPayments={hasPayments}
                            parentLocked={parentLocked}
                            chargeLocked={
                              isColumnLocked("chargeAmount") ||
                              isColumnLocked("chargeCurrency")
                            }
                            onEditItem={onEditItem}
                            onEditCharge={onEditCharge}
                            onAddPayment={onAddPayment}
                            onViewPayments={onViewPayments}
                            onToggleLock={onToggleLock}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
