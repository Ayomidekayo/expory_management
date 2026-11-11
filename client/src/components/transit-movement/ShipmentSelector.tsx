
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useShipments } from "../../hooks/shipments/useShipments";
import { getShipment } from "../../api/shipment.api";
import type { Shipment } from "../../types/shipment.types";

import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface ShipmentSelectorProps {
  value?: string | null;
  onChange: (shipmentId: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ShipmentSelector({
  value,
  onChange,
  disabled = false,
  placeholder = "Search and select a shipment...",
}: ShipmentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Avoid sending a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch a small, searchable shipment list.
  const {
    data: shipmentResponse,
    isLoading,
    isError,
  } = useShipments({
    page: 1,
    limit: 10,
    search: debouncedSearch || undefined,
    sortBy: "shipmentDate",
    sortOrder: "desc",
  });

  const shipments = shipmentResponse?.data ?? [];

  // If editing an existing movement, its shipment may not
  // be present in the current search results. Fetch it separately.
  const {
    data: selectedShipmentResponse,
  } = useQuery({
    queryKey: ["shipment", value],
    queryFn: () => getShipment(value!),
    enabled: Boolean(value),
  });

  const selectedShipment: Shipment | undefined =
    shipments.find((shipment) => shipment.id === value) ??
    selectedShipmentResponse?.data;

  const handleSelect = (shipmentId: string) => {
    onChange(shipmentId);
    setOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    onChange(null);
    setSearch("");
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            <span className="truncate text-left">
              {selectedShipment
                ? selectedShipment.shipmentNumber
                : placeholder}
            </span>

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search shipment number or client..."
              value={search}
              onValueChange={setSearch}
            />

            <CommandList>
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading shipments...
                </div>
              )}

              {!isLoading && isError && (
                <div className="py-6 text-center text-sm text-destructive">
                  Unable to load shipments. Please try again.
                </div>
              )}

              {!isLoading && !isError && (
                <>
                  <CommandEmpty>
                    No shipments found.
                  </CommandEmpty>

                  <CommandGroup heading="Available shipments">
                    {shipments.map((shipment) => (
                      <CommandItem
                        key={shipment.id}
                        value={shipment.id}
                        onSelect={() => handleSelect(shipment.id)}
                        className="flex items-start justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {shipment.shipmentNumber}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {shipment.client?.companyName ?? "No client"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              shipment.shipmentDate
                            ).toLocaleDateString()}
                            {" · "}
                            {shipment.transportMode}
                          </p>
                        </div>

                        {value === shipment.id && (
                          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedShipment && (
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {selectedShipment.shipmentNumber}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {selectedShipment.client?.companyName ?? "No client"}
            </p>
          </div>

          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={handleClear}
              aria-label="Clear selected shipment"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Shipment linking is optional. Leave this field empty for an independent transit movement.
      </p>
    </div>
  );
}
