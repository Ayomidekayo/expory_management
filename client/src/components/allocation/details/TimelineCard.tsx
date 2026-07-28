import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  UserCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import { Badge } from "../../ui/badge";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  icon: React.ReactNode;
}

export default function TimelineCard({
  allocation,
}: Props) {

  /**
   * Temporary Timeline
   * Replace with allocation.timeline
   * after backend implementation.
   */

  const events: TimelineEvent[] = [
    {
      id: "1",
      title: "Allocation Created",
      description: "Allocation was successfully created.",
      date: allocation.createdAt,
      completed: true,
      icon: <Package className="h-5 w-5" />,
    },

    {
      id: "2",
      title: "Officer Assignment",
      description:
        allocation.assignedTo
          ? `Assigned to ${allocation.assignedTo.name}`
          : "Awaiting assignment",

      date: allocation.updatedAt,

      completed: !!allocation.assignedTo,

      icon: <UserCheck className="h-5 w-5" />,
    },

    {
      id: "3",
      title: "Approval",

      description:
        allocation.status === "APPROVED"
          ? "Allocation approved."
          : "Waiting for approval.",

      date: allocation.updatedAt,

      completed:
        allocation.status === "APPROVED",

      icon: <CheckCircle2 className="h-5 w-5" />,
    },

    {
      id: "4",
      title: "Shipment Generated",

      description:
        allocation.shipment
          ? allocation.shipment.shipmentNumber
          : "Shipment not generated.",

      date: allocation.updatedAt,

      completed: !!allocation.shipment,

      icon: <Truck className="h-5 w-5" />,
    },
  ];

  return (
    <Card>

      <CardHeader>

        <CardTitle className="flex items-center gap-2">

          <CalendarClock className="h-5 w-5 text-indigo-600" />

          Activity Timeline

        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="relative ml-4">

          <div className="absolute left-3 top-0 h-full w-px bg-border" />

          <div className="space-y-8">

            {events.map((event) => (

              <div
                key={event.id}
                className="relative flex gap-5"
              >

                <div
                  className={`
                    z-10 flex h-7 w-7 items-center justify-center
                    rounded-full border
                    ${
                      event.completed
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {event.icon}
                </div>

                <div className="flex-1 rounded-lg border p-4">

                  <div className="mb-2 flex items-center justify-between">

                    <h4 className="font-semibold">

                      {event.title}

                    </h4>

                    <Badge
                      variant={
                        event.completed
                          ? "default"
                          : "secondary"
                      }
                    >
                      {event.completed
                        ? "Completed"
                        : "Pending"}
                    </Badge>

                  </div>

                  <p className="text-sm text-muted-foreground">

                    {event.description}

                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">

                    <Clock3 className="h-4 w-4" />

                    {event.date
                      ? new Date(
                          event.date
                        ).toLocaleString()
                      : "-"}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </CardContent>

    </Card>
  );
}