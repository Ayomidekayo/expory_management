import { Badge } from "../ui/badge";

interface Props {
  active: boolean;
}

export default function ClientStatusBadge({
  active,
}: Props) {
  return (
    <Badge
      variant={
        active
          ? "default"
          : "secondary"
      }
    >
      {active ? "Active" : "Inactive"}
    </Badge>
  );
}