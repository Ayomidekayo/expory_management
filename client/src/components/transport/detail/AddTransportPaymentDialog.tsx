
import { useEffect, useState } from "react";
import { Loader2, CreditCard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

import type { TransportItem } from "../../../types/transport";
import { useCreateTransportPayment } from "../../../hooks/transport/useTransportPayment";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: TransportItem | null;
  transportId: string;
}

const currencySymbols: Record<string, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  CFA: "CFA ",
};

const money = (value: number, currency: string) =>
  `${currencySymbols[currency] ?? ""}${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function AddTransportPaymentDialog({
  open,
  onOpenChange,
  item,
  transportId,
}: Props) {
  const createPayment = useCreateTransportPayment(transportId);

  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState<"ADVANCE" | "REGULAR">(
    "REGULAR",
  );
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setAmount("");
      setPaymentType(
        item?.paymentStatus === "UNPAID" ? "ADVANCE" : "REGULAR",
      );
      setPaymentDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod("");
      setReference("");
      setDescription("");
      setNotes("");
    }
  }, [open, item]);

  if (!item) return null;

  const charge = Number(item.chargeAmount ?? 0);
  const paid = (item.payments ?? []).reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );
  const balance = Math.max(charge - paid, 0);
  const numericAmount = Number(amount);
  const invalidAmount =
    !amount ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0 ||
    numericAmount > balance;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (invalidAmount) return;

    await createPayment.mutateAsync({
      itemId: item.id,
      payload: {
        amount: numericAmount,
        paymentType,
        paymentDate,
        paymentMethod: paymentMethod.trim() || undefined,
        reference: reference.trim() || undefined,
        description: description.trim() || undefined,
        notes: notes.trim() || undefined,
      },
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Record Transport Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment received for this transport item.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">Charge</p>
            <p className="font-semibold">
              {money(charge, item.chargeCurrency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="font-semibold text-green-700">
              {money(paid, item.chargeCurrency)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="font-semibold text-amber-700">
              {money(balance, item.chargeCurrency)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transport-payment-amount">Amount</Label>
            <Input
              id="transport-payment-amount"
              type="number"
              min="0.01"
              max={balance}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount received"
              required
            />
            {amount && invalidAmount && (
              <p className="text-xs text-red-600">
                Enter an amount greater than zero and not above the outstanding
                balance.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-payment-type">Payment Type</Label>
            <select
              id="transport-payment-type"
              value={paymentType}
              onChange={(event) =>
                setPaymentType(event.target.value as "ADVANCE" | "REGULAR")
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ADVANCE">Advance</option>
              <option value="REGULAR">Regular Payment</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-payment-date">Payment Date</Label>
            <Input
              id="transport-payment-date"
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-payment-method">Payment Method</Label>
            <Input
              id="transport-payment-method"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              placeholder="e.g. Bank Transfer, Cash"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-payment-reference">Reference</Label>
            <Input
              id="transport-payment-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="Transaction reference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-payment-description">Description</Label>
            <Input
              id="transport-payment-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transport-payment-notes">Notes</Label>
            <textarea
              id="transport-payment-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Additional notes..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createPayment.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={invalidAmount || createPayment.isPending}
            >
              {createPayment.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
