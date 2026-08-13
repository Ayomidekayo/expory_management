import {
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "../../ui/button";

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
  CreateAllocationOutput,
} from "../../../validations/allocation.schema";

import type {
  UseFormReturn,
  FieldPath,
} from "react-hook-form";

interface Props {
  form: UseFormReturn<
    CreateAllocationInput,
    any,
    CreateAllocationOutput
  >;
}

export default function ClientInformation({
  form,
}: Props) {
  const {
    clients,
    exporters,
    consignees,
  } = useAllocationLookups();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Client Information
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Select the client, exporter and consignee.
          </p>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SearchableSelect
            form={form}
            name="clientId"
            label="Client"
            options={clients.map((client) => ({
              value: client.id,
              label: client.companyName,
            }))}
          />

          <SearchableSelect
            form={form}
            name="exporterId"
            label="Exporter"
            options={exporters.map((exporter) => ({
              value: exporter.id,
              label: exporter.name,
            }))}
          />

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
    </div>
  );
}

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  form: UseFormReturn<
    CreateAllocationInput,
    any,
    CreateAllocationOutput
  >;

  name: FieldPath<CreateAllocationInput>;

  label: string;

  options: Option[];
}

function SearchableSelect({
  form,
  name,
  label,
  options,
}: SearchableSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="min-w-0">
          <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "h-11 w-full justify-between border-slate-200 bg-white px-3 text-left font-normal shadow-sm hover:bg-slate-50",
                    !field.value &&
                      "text-slate-400"
                  )}
                >
                  <span className="truncate">
                    {options.find(
                      (item) =>
                        item.value === field.value
                    )?.label ??
                      `Select ${label}`}
                  </span>

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] min-w-[220px] p-0"
              align="start"
            >
              <Command>
                <CommandInput
                  placeholder={`Search ${label}...`}
                  className="h-10"
                />

                <CommandEmpty className="py-6 text-center text-sm text-slate-500">
                  No {label.toLowerCase()} found.
                </CommandEmpty>

                <CommandGroup className="max-h-64 overflow-y-auto p-1">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() =>
                        field.onChange(
                          option.value === field.value
                            ? undefined
                            : option.value
                        )
                      }
                      className="cursor-pointer rounded-md px-2 py-2.5"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0 text-primary",
                          option.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />

                      <span className="truncate">
                        {option.label}
                      </span>
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