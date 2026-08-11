import { useState } from "react";
import {
  Loader2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";


import type {
  Container,
  TerminalChargeStatus,
} from "../../types/container.type";
import { useUpdateContainerTerminalCharge } from "../../hooks/container/useUpdateContainerTerminalChargeStatus";
import { Label } from "../ui/label";



interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  container: Container | null;
}

export default function TerminalChargeDialog({
  open,
  onOpenChange,
  container,
}: Props) {
  const mutation =
    useUpdateContainerTerminalCharge();

  const [
    status,
    setStatus,
  ] =
    useState<TerminalChargeStatus>(
      container?.terminalChargeStatus ??
        "UNPAID"
    );

  const [
    amount,
    setAmount,
  ] = useState(
    container?.terminalChargeAmount
      ?.toString() ?? ""
  );

  /*
   * Reset values whenever
   * another container is selected.
   */
  const handleOpenChange = (
    value: boolean
  ) => {
    if (value && container) {
      setStatus(
        container.terminalChargeStatus ??
          "UNPAID"
      );

      setAmount(
        container.terminalChargeAmount
          ?.toString() ?? ""
      );
    }

    onOpenChange(value);
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!container) {
      return;
    }

    /*
     * Amount is required
     * when payment is PAID.
     */
    if (
      status === "PAID" &&
      !amount.trim()
    ) {
      toast.error(
        "Please enter the amount paid."
      );

      return;
    }

    const numericAmount =
      amount.trim()
        ? Number(amount)
        : undefined;

    if (
      status === "PAID" &&
      (!numericAmount ||
        numericAmount <= 0)
    ) {
      toast.error(
        "Please enter a valid payment amount."
      );

      return;
    }

    mutation.mutate(
      {
        id: container.id,

        status,

        amount:
          status === "PAID"
            ? numericAmount
            : undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            "Terminal charge updated successfully."
          );

          onOpenChange(false);
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ??
              "Unable to update terminal charge."
          );
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-700" />

            Terminal Charge Payment
          </DialogTitle>
        </DialogHeader>

        {container && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Container */}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-muted-foreground">
                Container
              </p>

              <p className="mt-1 font-semibold">
                {container.containerNumber}
              </p>
            </div>

            {/* Status */}

            <div className="space-y-2">

             <label
  htmlFor="terminal-charge-amount"
  className="text-sm font-medium"
>
  Amount Paid
  {status === "PAID" && (
    <span className="text-red-500"> *</span>
  )}
</label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as TerminalChargeStatus
                  )
                }
                className="
                  flex
                  h-10
                  w-full
                  rounded-md
                  border
                  bg-background
                  px-3
                  py-2
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-emerald-600
                "
              >
                <option value="UNPAID">
                  Unpaid
                </option>

                <option value="PAID">
                  Paid
                </option>
              </select>

            </div>

            {/* Amount */}

            <div className="space-y-2">

              <Label htmlFor="terminal-charge-amount">
                Amount Paid
                {status === "PAID" && (
                  <span className="text-red-500">
                    {" "}*
                  </span>
                )}
              </Label>

              <Input
                id="terminal-charge-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value
                  )
                }
                placeholder="Enter amount paid"
              />

              <p className="text-xs text-muted-foreground">
                The amount is optional while
                the charge is unpaid.
              </p>

            </div>

            {/* Actions */}

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
                disabled={
                  mutation.isPending
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  mutation.isPending
                }
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                    Saving...
                  </>
                ) : (
                  "Save Payment"
                )}
              </Button>

            </div>

          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}