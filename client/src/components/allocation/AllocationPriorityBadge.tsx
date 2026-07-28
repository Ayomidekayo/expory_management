import { Badge } from "../ui/badge";

interface Props {
  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";
}

export default function AllocationPriorityBadge({
  priority,
}: Props) {
  switch (priority) {
    case "LOW":
      return (
        <Badge className="bg-green-100 text-green-700">
          Low
        </Badge>
      );

    case "MEDIUM":
      return (
        <Badge className="bg-yellow-100 text-yellow-700">
          Medium
        </Badge>
      );

    case "HIGH":
      return (
        <Badge className="bg-orange-100 text-orange-700">
          High
        </Badge>
      );

    case "URGENT":
      return (
        <Badge className="bg-red-100 text-red-700">
          Urgent
        </Badge>
      );

    default:
      return (
        <Badge>
          {priority}
        </Badge>
      );
  }
}