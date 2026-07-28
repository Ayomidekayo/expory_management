import { Badge } from "../../ui/badge";

interface Props {
  status:
    | "DRAFT"
    | "SENT"
    | "APPROVED"
    | "PAID"
    | "CANCELLED";
}

const variants = {
  DRAFT: "secondary",
  SENT: "outline",
  APPROVED: "default",
  PAID: "default",
  CANCELLED: "destructive",
} as const;

export default function InvoiceStatusBadge({
  status,
}: Props) {
  return (
    <Badge
      variant={variants[status]}
    >
      {status.replaceAll("_", " ")}
    </Badge>
  );
}