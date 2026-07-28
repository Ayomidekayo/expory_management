import {
  Package,
  Truck,
  FileText,
  Users,
  Boxes,
  FolderOpen,
} from "lucide-react";

import SummaryCard from "../common/SummaryCard";

interface Props {
  statistics: {
    allocations: number;
    shipments: number;
    invoices: number;
    clients: number;
    containers: number;
    documents: number;
  };
}

const cards = [
  {
    key: "allocations",
    title: "Allocations",
    subtitle: "Total export allocations",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "shipments",
    title: "Shipments",
    subtitle: "Processed shipments",
    icon: Truck,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    key: "invoices",
    title: "Invoices",
    subtitle: "Generated invoices",
    icon: FileText,
    color: "bg-amber-100 text-amber-600",
  },
  {
    key: "clients",
    title: "Clients",
    subtitle: "Registered clients",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    key: "containers",
    title: "Containers",
    subtitle: "Tracked containers",
    icon: Boxes,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    key: "documents",
    title: "Documents",
    subtitle: "Uploaded documents",
    icon: FolderOpen,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function DashboardStatistics({
  statistics,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <SummaryCard
          key={card.key}
          title={card.title}
          value={
            statistics[
              card.key as keyof typeof statistics
            ]
          }
          subtitle={card.subtitle}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
}