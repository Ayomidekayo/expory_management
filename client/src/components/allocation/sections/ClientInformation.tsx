
import {
  Check,
  ChevronsUpDown,
} from "lucide-react";

import {
  Button,
} from "../../ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { cn } from "../../../lib/utils";

import { useAllocationLookups } from "../../../hooks/allocation/useAllocationLookups";

import type {
  CreateAllocationInput,
} from "../../../validations/allocation.schema";
import type { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<CreateAllocationInput>;
}

export default function ClientInformation({
  form,
}: Props) {
  const {
    clients,
    exporters,
    consignees,
  } = useAllocationLookups();
  console.log("Allocation ClientInformation");
console.log(form);

  return (
    <div className="rounded-xl border bg-white p-6 space-y-6">

      <div>

        <h2 className="text-xl font-semibold">
          Client Information
        </h2>

        <p className="text-sm text-slate-500">
          Select the client, exporter and consignee.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {/* CLIENT */}

        <SearchableSelect
          form={form}
          name="clientId"
          label="Client"
          options={clients.map((client) => ({
            value: client.id,
            label: client.companyName,
          }))}
        />

        {/* EXPORTER */}

        <SearchableSelect
          form={form}
          name="exporterId"
          label="Exporter"
          options={exporters.map((exporter) => ({
            value: exporter.id,
            label: exporter.name,
          }))}
        />

        {/* CONSIGNEE */}

        <SearchableSelect
          form={form}
          name="consigneeId"
          label="Consignee"
          options={consignees.map((consignee) => ({
            value: consignee.id,
            label: consignee.name,
          }))}
        />

      </div>

    </div>
  );
}

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  form: UseFormReturn<any>;

  name: string;

  label: string;

  options: Option[];
}
function SearchableSelect({
  form,
  name,
  label,
  options,
}: SearchableSelectProps) {
  console.log("SearchableSelect:", {
    form,
    name,
    label,
  });

  if (!form) {
    return (
      <div className="text-red-500">
        Form is undefined
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (

        <FormItem className="flex flex-col">

          <FormLabel>
            {label}
          </FormLabel>

          <Popover>

            <PopoverTrigger asChild>

              <FormControl>

                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between",
                    !field.value &&
                      "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? options.find(
                        (item) =>
                          item.value ===
                          field.value
                      )?.label
                    : `Select ${label}`}

                  <ChevronsUpDown className="h-4 w-4 opacity-50" />

                </Button>

              </FormControl>

            </PopoverTrigger>

            <PopoverContent className="w-full p-0">

              <Command>

                <CommandInput
                  placeholder={`Search ${label}`}
                />

                <CommandEmpty>
                  No {label} found.
                </CommandEmpty>

                <CommandGroup>

                  {options.map((option) => (

                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() =>
                        field.onChange(
                          option.value
                        )
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          option.value ===
                            field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />

                      {option.label}

                    </CommandItem>

                  ))}

                </CommandGroup>

              </Command>

            </PopoverContent>

          </Popover>

          <FormMessage />

        </FormItem>

      )}
    />
  );
}