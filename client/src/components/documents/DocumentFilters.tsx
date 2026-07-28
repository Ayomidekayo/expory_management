import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { DocumentType } from "../../types/enums";

import { useShipments } from "../../hooks/shipments/useShipments";

import type { DocumentQuery } from "../../types/document";

interface Props {
  filters: DocumentQuery;
  onChange: (filters: DocumentQuery) => void;
}

export default function DocumentFilters({
  filters,
  onChange,
}: Props) {

  const {
    data: shipments,
  } = useShipments();

  return (

    <div className="rounded-xl border bg-white p-6">

      <div className="grid gap-4 md:grid-cols-4">

        {/* Search */}

        <Input
          placeholder="Search document..."
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value,
            })
          }
        />

        {/* Document Type */}

        <Select
          value={filters.type ?? ""}
          onValueChange={(value) =>
            onChange({
              ...filters,
              type:
                value === ""
                  ? undefined
                  : value as DocumentType,
            })
          }
        >

          <SelectTrigger>

            <SelectValue
              placeholder="Document Type"
            />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="">
              All Types
            </SelectItem>

            {Object.values(DocumentType).map(
              (type) => (

                <SelectItem
                  key={type}
                  value={type}
                >
                  {type.replaceAll("_", " ")}
                </SelectItem>

              )
            )}

          </SelectContent>

        </Select>

        {/* Shipment */}

        <Select
          value={filters.shipmentId ?? ""}
          onValueChange={(value) =>
            onChange({
              ...filters,
              shipmentId:
                value === ""
                  ? undefined
                  : value,
            })
          }
        >

          <SelectTrigger>

            <SelectValue
              placeholder="Shipment"
            />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="">
              All Shipments
            </SelectItem>

            {shipments?.data?.map(
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

        {/* Reset */}

        <Button
          variant="outline"
          onClick={() =>
            onChange({})
          }
        >

          <X className="mr-2 h-4 w-4" />

          Reset

        </Button>

      </div>

    </div>

  );

}