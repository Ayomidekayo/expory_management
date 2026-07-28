import {
  CheckCircle2,
  Pencil,
  Trash2,
  Truck,
  UserCheck,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import { Button } from "../../ui/button";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function ActionCard({
  allocation,
}: Props) {
  const navigate = useNavigate();

  return (
    <Card>

      <CardHeader>

        <CardTitle>

          Workflow Actions

        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Edit */}

          <Button
            variant="outline"
            className="justify-start"
            onClick={() =>
              navigate(
                `/allocations/${allocation.id}/edit`
              )
            }
          >
            <Pencil className="mr-2 h-4 w-4" />

            Edit Allocation

          </Button>

          {/* Assign */}

          <Button
            className="justify-start"
            variant="outline"
            onClick={() => {
              // TODO:
              // Open Assign Officer Dialog
            }}
          >
            <UserCheck className="mr-2 h-4 w-4" />

            Assign Officer

          </Button>

          {/* Approve */}

          <Button
            className="justify-start"
            variant="outline"
            disabled={
              allocation.status === "APPROVED"
            }
            onClick={() => {
              // TODO:
              // Open Approve Dialog
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />

            Approve

          </Button>

          {/* Reject */}

          <Button
            className="justify-start"
            variant="outline"
            disabled={
              allocation.status === "REJECTED"
            }
            onClick={() => {
              // TODO:
              // Reject Allocation
            }}
          >
            <XCircle className="mr-2 h-4 w-4" />

            Reject

          </Button>

          {/* Shipment */}

          <Button
            className="justify-start"
            variant="outline"
            disabled={!!allocation.shipment}
            onClick={() => {
              // TODO:
              // Generate Shipment
            }}
          >
            <Truck className="mr-2 h-4 w-4" />

            Generate Shipment

          </Button>

          {/* Delete */}

          <Button
            variant="destructive"
            className="justify-start"
            onClick={() => {
              // TODO:
              // Delete Dialog
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />

            Delete Allocation

          </Button>

        </div>

      </CardContent>

    </Card>
  );
}