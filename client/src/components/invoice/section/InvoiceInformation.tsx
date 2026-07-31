import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import type {
  CreateInvoiceInput,
  CreateInvoiceOutput,
} from "../../../validations/invoice.validation";

interface Props {
  form: UseFormReturn<
    CreateInvoiceInput,
    undefined,
    CreateInvoiceOutput
  >;
}

const currencies = [
  {
    value: "NGN",
    label: "Nigerian Naira (NGN)",
  },
  {
    value: "USD",
    label: "US Dollar (USD)",
  },
  {
    value: "EUR",
    label: "Euro (EUR)",
  },
];

const paymentTerms = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "ADVANCE",
    label: "Advance Payment",
  },
  {
    value: "COD",
    label: "Cash On Delivery",
  },
  {
    value: "NET_15",
    label: "Net 15",
  },
  {
    value: "NET_30",
    label: "Net 30",
  },
  {
    value: "NET_60",
    label: "Net 60",
  },
  {
    value: "LETTER_OF_CREDIT",
    label: "Letter Of Credit",
  },
];

const statuses = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "SENT",
    label: "Sent",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "PAID",
    label: "Paid",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

export default function InvoiceInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Invoice Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Commercial invoice details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Invoice Date */}

        <FormField
          control={form.control}
          name="invoiceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Invoice Date
              </FormLabel>

              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currency */}

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Currency
              </FormLabel>

              <Select
                value={
                  typeof field.value === "string"
                    ? field.value
                    : ""
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem
                      key={currency.value}
                      value={currency.value}
                    >
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Exchange Rate */}

        <FormField
          control={form.control}
          name="exchangeRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Exchange Rate
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="1.00"
                  value={
                    typeof field.value === "number"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(
                            e.target.value
                          )
                    )
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Terms */}

        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Payment Terms
              </FormLabel>

              <Select
                value={
                  typeof field.value === "string"
                    ? field.value
                    : ""
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Terms" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {paymentTerms.map((term) => (
                    <SelectItem
                      key={term.value}
                      value={term.value}
                    >
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Status
              </FormLabel>

              <Select
                value={
                  typeof field.value === "string"
                    ? field.value
                    : ""
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Transport Units */}

        <FormField
          control={form.control}
          name="transportUnits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Transport Units
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  value={
                    typeof field.value === "number"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(
                            e.target.value
                          )
                    )
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Freight */}

        <FormField
          control={form.control}
          name="freight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Freight
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={
                    typeof field.value === "number"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? 0
                        : Number(
                            e.target.value
                          )
                    )
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Incoterm */}

        <FormField
          control={form.control}
          name="incoterm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Incoterm
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="FOB"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Commercial Reference */}

        <FormField
          control={form.control}
          name="commercialReference"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>
                Commercial Reference
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Reference Number"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}