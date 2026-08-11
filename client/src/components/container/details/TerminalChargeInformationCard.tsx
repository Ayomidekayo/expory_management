import { Banknote, CheckCircle2, Clock3 } from "lucide-react";

import { Badge } from "../../ui/badge";
import type { Container } from "../../../types/container.type";

interface Props {
  container: Container;
}

export default function TerminalChargeInformationCard({
  container,
}: Props) {
  const status = container.terminalChargeStatus;

  const isPaid = status === "PAID";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Terminal Charges
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Payment information for terminal charges.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Banknote className="h-5 w-5 text-slate-600" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {/* STATUS */}
        <div>
          <p className="text-sm text-muted-foreground">
            Payment Status
          </p>

          <div className="mt-2">
            {isPaid ? (
              <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Paid
              </Badge>
            ) : (
              <Badge className="gap-1 bg-red-100 text-red-700 hover:bg-red-100">
                <Clock3 className="h-3.5 w-3.5" />
                Unpaid
              </Badge>
            )}
          </div>
        </div>

        {/* AMOUNT */}
        <div>
          <p className="text-sm text-muted-foreground">
            Amount Paid
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-900">
            {container.terminalChargeAmount != null
              ? `₦${Number(
                  container.terminalChargeAmount
                ).toLocaleString()}`
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}