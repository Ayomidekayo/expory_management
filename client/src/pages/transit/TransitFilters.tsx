import {
  Search,
  RotateCcw,
} from "lucide-react";


import { useShipments } from "../../hooks/shipments/useShipments";
import { useContainers } from "../../hooks/container/useContainers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import type { TransitQuery } from "../../types/transit.type";

interface Props {

  filters: TransitQuery;

  onChange: (
    filters: TransitQuery
  ) => void;

}

export default function TransitFilters({
  filters,
  onChange,
}: Props) {

  const {
    data: shipments,
  } = useShipments();

  const {
    data: containers,
  } = useContainers();

  return (

    <div className="rounded-xl border bg-white p-6">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

        {/* Search */}

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input

            className="pl-9"

            placeholder="Search..."

            value={filters.search ?? ""}

            onChange={(e) =>

              onChange({

                ...filters,

                search: e.target.value,

                page: 1,

              })

            }

          />

        </div>

        {/* Shipment */}

        <Select

          value={filters.shipmentId ?? "all"}

          onValueChange={(value) =>

            onChange({

              ...filters,

              shipmentId:

                value === "all"
                  ? undefined
                  : value,

              page: 1,

            })

          }

        >

          <SelectTrigger>

            <SelectValue placeholder="Shipment" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">

              All Shipments

            </SelectItem>

            {shipments?.data.map(

              (shipment) => (

                <SelectItem

                  key={shipment.id}

                  value={shipment.id}

                >

                  {shipment.shipmentNumber}

                </SelectItem>

              )

            )}

          </SelectContent>

        </Select>

        {/* Container */}

        <Select

          value={filters.containerId ?? "all"}

          onValueChange={(value) =>

            onChange({

              ...filters,

              containerId:

                value === "all"
                  ? undefined
                  : value,

              page: 1,

            })

          }

        >

          <SelectTrigger>

            <SelectValue placeholder="Container" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">

              All Containers

            </SelectItem>

            {containers?.data.map(

              (container) => (

                <SelectItem

                  key={container.id}

                  value={container.id}

                >

                  {container.containerNumber}

                </SelectItem>

              )

            )}

          </SelectContent>

        </Select>

        {/* Transport */}

        <Select

          value={
            filters.transportMode ??
            "all"
          }

          onValueChange={(value) =>

            onChange({

              ...filters,

              transportMode:

                value === "all"
                  ? undefined
                  : value as any,

              page: 1,

            })

          }

        >

          <SelectTrigger>

            <SelectValue placeholder="Mode" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">

              All Modes

            </SelectItem>

            <SelectItem value="ROAD">

              Road

            </SelectItem>

            <SelectItem value="SEA">

              Sea

            </SelectItem>

            <SelectItem value="AIR">

              Air

            </SelectItem>

          </SelectContent>

        </Select>

        {/* Reset */}

        <Button

          variant="outline"

          onClick={() =>

            onChange({

              page: 1,

              limit: 10,

            })

          }

        >

          <RotateCcw className="mr-2 h-4 w-4" />

          Reset

        </Button>

      </div>

    </div>

  );

}