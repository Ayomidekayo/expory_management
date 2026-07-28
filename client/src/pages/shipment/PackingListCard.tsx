import { Link } from "react-router-dom";

import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";


interface Props {
  shipment: any;
}

export default function PackingListCard({
  shipment,
}: Props) {
  const packing = shipment.packingList;

  return (
    <Card>

      <CardHeader className="flex justify-between flex-row items-center">

        <CardTitle>
          Packing List
        </CardTitle>

        {packing ? (
          <Button asChild variant="outline">
            <Link
              to={`/packing-lists/${packing.id}`}
            >
              View Packing List
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link
              to={`/packing-lists/new?shipment=${shipment.id}`}
            >
              Create Packing List
            </Link>
          </Button>
        )}

      </CardHeader>

      <CardContent>

        {packing ? (

          <div className="grid grid-cols-2 gap-6">

            <div>

              <p className="text-sm text-muted-foreground">
                Gross Weight
              </p>

              <p>
                {packing.grossWeight} KG
              </p>

            </div>

            <div>

              <p className="text-sm text-muted-foreground">
                Net Weight
              </p>

              <p>
                {packing.netWeight} KG
              </p>

            </div>

          </div>

        ) : (

          <div className="flex items-center gap-3">

            <Package className="w-6 h-6"/>

            <p>
              Packing List has not been created.
            </p>

          </div>

        )}

      </CardContent>

    </Card>
  );
}