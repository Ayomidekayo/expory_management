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

/* ===========================================
   OPTIONS
=========================================== */

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
    value: "UNPAID",
    label: "Unpaid",
  },
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

/* ===========================================
   SHARED FIELD STYLES
=========================================== */

const inputClassName =
  "h-11 rounded-lg border-slate-200 bg-white px-3.5 text-sm shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20";

const selectClassName =
  "h-11 w-full rounded-lg border-slate-200 bg-white px-3.5 text-sm shadow-sm transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

const labelClassName =
  "text-sm font-medium text-slate-700";

export default function InvoiceInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Invoice Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Commercial invoice details.
        </p>
      </div>

      {/* =========================================
          FORM GRID
      ========================================= */}

      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* =========================================
            INVOICE DATE
        ========================================= */}

        <FormField
          control={form.control}
          name="invoiceDate"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
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
                  className={inputClassName}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            EXTERNAL INVOICE NUMBER
        ========================================= */}

        <FormField
          control={form.control}
          name="externalInvoiceNumber"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
                External Invoice Number
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Client/vendor invoice number"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  className={inputClassName}
                />
              </FormControl>

              <p className="min-h-4 text-xs text-slate-400">
                Optional
              </p>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            CURRENCY
        ========================================= */}

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
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
                  <SelectTrigger
                    className={selectClassName}
                  >
                    <SelectValue placeholder="Select currency" />
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

        {/* =========================================
            EXCHANGE RATE
        ========================================= */}

        <FormField
          control={form.control}
          name="exchangeRate"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
                Exchange Rate
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="1.0000"
                  value={
                    typeof field.value === "number"
                      ? field.value
                      : ""
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  className={inputClassName}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            PAYMENT TERMS
        ========================================= */}

        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
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
                  <SelectTrigger
                    className={selectClassName}
                  >
                    <SelectValue placeholder="Select payment terms" />
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

        {/* =========================================
            STATUS
        ========================================= */}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
                Status
              </FormLabel>

              <Select
                value={
                  typeof field.value === "string"
                    ? field.value
                    : "UNPAID"
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger
                    className={selectClassName}
                  >
                    <SelectValue placeholder="Select status" />
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

        {/* =========================================
            TRANSPORT UNITS
        ========================================= */}

        <FormField
          control={form.control}
          name="transportUnits"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
                Transport Units
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
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
                        : Number(e.target.value)
                    )
                  }
                  className={inputClassName}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            FREIGHT
        ========================================= */}

        <FormField
          control={form.control}
          name="freight"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
                Freight
              </FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min="0"
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
                        : Number(e.target.value)
                    )
                  }
                  className={inputClassName}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            INCOTERM
        ========================================= */}

        <FormField
          control={form.control}
          name="incoterm"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className={labelClassName}>
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
                  className={inputClassName}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* =========================================
            COMMERCIAL REFERENCE
        ========================================= */}

        <FormField
          control={form.control}
          name="commercialReference"
          render={({ field }) => (
            <FormItem className="sm:col-span-2 lg:col-span-2 space-y-2">
              <FormLabel className={labelClassName}>
                Commercial Reference
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Reference number"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  className={inputClassName}
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