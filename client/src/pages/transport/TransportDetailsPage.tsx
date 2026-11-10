
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Truck,
  Package,
  CalendarDays,
  FileText,
  Lock,
  Unlock,
  Loader2,
  Wallet,
  Link2,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

import { useTransport } from "../../hooks/transport/useTransport";
import { useTransportItemLock } from "../../hooks/transport/useTransportItemLock";
import { useTransportColumnLocks } from "../../hooks/transport/useTransportColumnLocks";



import type {
  Transport,
  TransportItem,
  Currency,
} from "../../types/transport";
import TransportItemsTable from "../../components/transport/detail/TransportItemsTable";
import AddTransportPaymentDialog from "../../components/transport/detail/AddTransportPaymentDialog";
import TransportPaymentHistoryDialog from "../../components/transport/detail/TransportPaymentHistoryDialog";
import DeleteTransportDialog from "../../components/transport/eleteTransportDialog";

function formatCurrency(amount: number, currency: Currency) {
  const symbols: Record<Currency, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    CFA: "CFA ",
  };

  return `${symbols[currency]}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getPaymentTotals(items: TransportItem[]) {
  const totals: Record<
    string,
    { charges: number; paid: number; balance: number }
  > = {};

  items.forEach((item) => {
    const currency = item.chargeCurrency;

    if (!totals[currency]) {
      totals[currency] = {
        charges: 0,
        paid: 0,
        balance: 0,
      };
    }

    const charge = Number(item.chargeAmount ?? 0);

    const paid = (item.payments ?? []).reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0,
    );

    totals[currency].charges += charge;
    totals[currency].paid += paid;
    totals[currency].balance += Math.max(charge - paid, 0);
  });

  return totals;
}

export default function TransportDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] =
    useState<TransportItem | null>(null);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  const {
    data: transport,
    isLoading,
    isError,
  } = useTransport(id ?? "");

  const itemLockMutation = useTransportItemLock(transport?.id ?? "");

  const {
    data: columnLocks = [],
  } = useTransportColumnLocks();

  // The useTransport hook returns Transport directly.
  const currentTransport: Transport | undefined = transport;

  if (isLoading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading transport details...
      </div>
    );
  }

  if (isError || !currentTransport?.id) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <Truck className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

        <h2 className="text-xl font-semibold">
          Transport Record Not Found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Unable to load this transport record.
        </p>

        <Button
          className="mt-5"
          onClick={() => navigate("/transports")}
        >
          Back to Transports
        </Button>
      </div>
    );
  }

  const items = currentTransport.items ?? [];
  const paymentTotals = getPaymentTotals(items);

  const totalItems = items.length;
  const totalTrucks = items.filter(
    (item) => item.itemType === "TRUCK",
  ).length;
  const totalContainers = items.filter(
    (item) => item.itemType === "CONTAINER",
  ).length;

  const allPaid =
    items.length > 0 &&
    items.every((item) => item.paymentStatus === "PAID");

  const lockedColumns = columnLocks
    .filter((lock) => lock.isLocked)
    .map((lock) => lock.columnKey);

  const handleAddPayment = (item: TransportItem) => {
    setSelectedItem(item);
    setPaymentDialogOpen(true);
  };

  const handleViewPayments = (item: TransportItem) => {
    setSelectedItem(item);
    setHistoryDialogOpen(true);
  };

  const handleToggleItemLock = (item: TransportItem) => {
    if (currentTransport.isLocked || itemLockMutation.isPending) return;

    itemLockMutation.mutate({
      itemId: item.id,
      isLocked: !item.isLocked,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/transports")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {currentTransport.transportNumber}
              </h1>

              {currentTransport.isLocked ? (
                <Badge variant="destructive">
                  <Lock className="mr-1 h-3 w-3" />
                  Locked
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <Unlock className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Transport record details and financial information.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={currentTransport.isLocked}
            asChild
          >
            <Link to={`/transports/${currentTransport.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Transport
            </Link>
          </Button>

          <Button
            variant="destructive"
            disabled={currentTransport.isLocked}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* TRANSPORT INFORMATION */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">
            Transport Information
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Transport Number
            </p>
            <p className="mt-1 font-semibold">
              {currentTransport.transportNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Transport Date
            </p>
            <p className="mt-1 flex items-center gap-2 font-medium">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              {new Date(
                currentTransport.transportDate,
              ).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Shipment
            </p>

            {currentTransport.shipment ? (
              <div className="mt-1">
                <Link
                  to={`/shipments/${currentTransport.shipment.id}`}
                  className="flex items-center gap-2 font-medium text-emerald-700 hover:underline"
                >
                  <Link2 className="h-4 w-4" />
                  {currentTransport.shipment.shipmentNumber}
                </Link>

                {currentTransport.shipment.client?.companyName && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentTransport.shipment.client.companyName}
                  </p>
                )}
              </div>
            ) : (
              <Badge variant="outline" className="mt-1">
                Independent Transport
              </Badge>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Total Items
            </p>
            <p className="mt-1 font-semibold">{totalItems}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Created
            </p>
            <p className="mt-1 font-medium">
              {new Date(
                currentTransport.createdAt,
              ).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Updated
            </p>
            <p className="mt-1 font-medium">
              {new Date(
                currentTransport.updatedAt,
              ).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        {currentTransport.remarks && (
          <div className="mt-6 border-t pt-5">
            <p className="text-sm text-muted-foreground">
              Remarks
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm">
              {currentTransport.remarks}
            </p>
          </div>
        )}
      </section>

      {/* ITEM STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Items
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {totalItems}
              </h3>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Trucks
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {totalTrucks}
              </h3>
            </div>
            <div className="rounded-lg bg-emerald-100 p-3">
              <Truck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Containers
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                {totalContainers}
              </h3>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* FINANCIAL SUMMARY */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold">
            Financial Summary
          </h2>
        </div>

        {Object.keys(paymentTotals).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No transport charges have been recorded.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(paymentTotals).map(([currency, totals]) => (
              <div
                key={currency}
                className="rounded-lg border p-4"
              >
                <div className="mb-4 font-semibold">
                  {currency}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Charges
                    </p>
                    <p className="mt-1 font-bold">
                      {formatCurrency(
                        totals.charges,
                        currency as Currency,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Paid
                    </p>
                    <p className="mt-1 font-bold text-emerald-700">
                      {formatCurrency(
                        totals.paid,
                        currency as Currency,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Outstanding
                    </p>
                    <p className="mt-1 font-bold text-amber-700">
                      {formatCurrency(
                        totals.balance,
                        currency as Currency,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {allPaid && (
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
            All transport items have been fully paid.
          </div>
        )}
      </section>

      {/* TRANSPORT ITEMS */}
      <TransportItemsTable
        items={items}
        parentLocked={currentTransport.isLocked}
        lockedColumns={lockedColumns}
        onEditItem={(item) => {
          navigate(`/transports/${currentTransport.id}/edit?itemId=${item.id}`);
        }}
        onEditCharge={(item) => {
          navigate(`/transports/${currentTransport.id}/edit?itemId=${item.id}&editCharge=true`);
        }}
        onAddPayment={handleAddPayment}
        onViewPayments={handleViewPayments}
        onToggleLock={handleToggleItemLock}
      />

      {/* ADD PAYMENT */}
      <AddTransportPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        item={selectedItem}
        transportId={currentTransport.id}
      />

      {/* PAYMENT HISTORY */}
      <TransportPaymentHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        item={selectedItem}
      />

      {/* DELETE */}
      <DeleteTransportDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        transportId={currentTransport.id}
        transportNumber={currentTransport.transportNumber}
      />
    </div>
  );
}
