import { Badge } from "../../ui/badge";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  const normalized =
    status.toUpperCase();

  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = "secondary";

  switch (normalized) {
    case "APPROVED":
    case "COMPLETED":
    case "DELIVERED":
      variant = "default";
      break;

    case "IN_PROGRESS":
    case "IN_TRANSIT":
    case "READY":
    case "BOOKED":
      variant = "outline";
      break;

    case "REJECTED":
    case "CANCELLED":
      variant = "destructive";
      break;
  }

  return (
    <Badge variant={variant}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}