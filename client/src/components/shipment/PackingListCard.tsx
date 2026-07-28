import { Link } from "react-router-dom";

import { Package, Plus, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Button } from "../ui/button";
import type { Shipment } from "../../types/shipment";

interface Props {
  shipment: Shipment;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  );
}

export default function PackingListCard({ shipment }: Props) {
  const packingList = shipment.packingList;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Packing List
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!packingList ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />

            <h3 className="font-semibold">No Packing List</h3>

            <p className="mb-6 text-sm text-muted-foreground">
              This shipment does not have a packing list yet.
            </p>

            <Button asChild>
              <Link to={`/packing-lists/new?shipmentId=${shipment.id}`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Packing List
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Row
              label="Packing List No."
              value={packingList.packingListNumber ?? "Not Assigned"}
            />

            <Row
              label="Gross Weight"
              value={`${Number(packingList.grossWeight).toLocaleString()} kg`}
            />

            <Row
              label="Net Weight"
              value={`${Number(packingList.netWeight).toLocaleString()} kg`}
            />

            <div className="pt-4">
              <Button asChild className="w-full">
                <Link to={`/packing-lists/${packingList.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Packing List
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
