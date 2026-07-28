import { Badge } from "../ui/badge";

interface Props {
  status:
    | "PENDING"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
}

export default function AllocationStatusBadge({
  status,
}: Props) {
  const styles = {
    PENDING:
      "bg-yellow-100 text-yellow-700",

    UNDER_REVIEW:
      "bg-blue-100 text-blue-700",

    APPROVED:
      "bg-green-100 text-green-700",

    REJECTED:
      "bg-red-100 text-red-700",

    IN_PROGRESS:
      "bg-purple-100 text-purple-700",

    COMPLETED:
      "bg-emerald-100 text-emerald-700",

    CANCELLED:
      "bg-gray-100 text-gray-700",
  };

  return (
    <Badge
      className={styles[status]}
    >
      {status.replaceAll("_", " ")}
    </Badge>
  );
}