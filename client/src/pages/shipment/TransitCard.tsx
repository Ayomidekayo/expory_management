import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";




interface Props {
  shipment: any;
}

export default function TransitCard({
  shipment,
}: Props) {

  return (

    <Card>

      <CardHeader className="flex justify-between flex-row">

        <CardTitle>

          Transit Records

        </CardTitle>

        <Button asChild>

          <Link
            to={`/transits/new?shipment=${shipment.id}`}
          >
            Add Transit
          </Link>

        </Button>

      </CardHeader>

      <CardContent>

        {shipment.transits.length === 0 ? (

          <p className="text-muted-foreground">

            No transit records available.

          </p>

        ) : (

          <div className="space-y-4">

            {shipment.transits.map((item: any) => (

              <div
                key={item.id}
                className="border rounded-lg p-4"
              >

                <div className="font-semibold">

                  {item.origin}

                  →

                  {item.destination}

                </div>

                <div className="text-sm text-muted-foreground">

                  {item.transportMode}

                </div>

              </div>

            ))}

          </div>

        )}

      </CardContent>

    </Card>

  );
}