import {
  CheckCircle2,
  CircleDollarSign,
  ChevronDown,
} from "lucide-react";

import { Badge } from "../../ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import type { InvoiceStatus } from "../../../types/invoice";

interface Props {
  status: InvoiceStatus;

  loading?: boolean;

  onChange: (
    status: InvoiceStatus
  ) => void;
}

const statusConfig = {
  UNPAID: {
    label: "Unpaid",
    className:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    icon: CircleDollarSign,
  },

  PAID: {
    label: "Paid",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    icon: CheckCircle2,
  },
} as const;

export default function InvoiceStatusBadge({
  status,
  loading = false,
  onChange,
}: Props) {
  /*
   * We only allow payment status changes
   * between UNPAID and PAID.
   */

  const config =
    statusConfig[
      status as keyof typeof statusConfig
    ];

  /*
   * If the invoice currently has another
   * workflow status such as DRAFT, SENT,
   * APPROVED or CANCELLED, don't crash.
   */

  if (!config) {
    return (
      <Badge variant="outline">
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        disabled={loading}
      >
        <button
          type="button"
          disabled={loading}
          className="
            inline-flex
            cursor-pointer
            items-center
            rounded-full
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
            focus:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Badge
            className={`
              gap-1.5
              border
              ${config.className}
            `}
          >
            <Icon className="h-3.5 w-3.5" />

            {loading
              ? "Updating..."
              : config.label}

            {!loading && (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Badge>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-40"
      >
        {/* UNPAID */}

        <DropdownMenuItem
          disabled={
            status === "UNPAID"
          }
          onClick={() =>
            onChange("UNPAID")
          }
          className="cursor-pointer"
        >
          <CircleDollarSign className="mr-2 h-4 w-4 text-red-600" />

          Unpaid

          {status === "UNPAID" && (
            <span className="ml-auto text-xs text-muted-foreground">
              Current
            </span>
          )}
        </DropdownMenuItem>

        {/* PAID */}

        <DropdownMenuItem
          disabled={
            status === "PAID"
          }
          onClick={() =>
            onChange("PAID")
          }
          className="cursor-pointer"
        >
          <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />

          Paid

          {status === "PAID" && (
            <span className="ml-auto text-xs text-muted-foreground">
              Current
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}