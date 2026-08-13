import type { UseFormReturn } from "react-hook-form";

import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FileText,
  Hash,
  Landmark,
  ReceiptText,
  RefreshCw,
  Scale,
  WalletCards,
} from "lucide-react";

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

/* =========================================
   OPTIONS
========================================= */

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

/* =========================================
   SHARED STYLES
========================================= */

const inputClassName =
  "h-11 w-full rounded-lg border-slate-200 bg-white px-3.5 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10";

const selectClassName =
  "h-11 w-full rounded-lg border-slate-200 bg-white px-3.5 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClassName =
  "text-sm font-medium text-slate-700";

/* =========================================
   FIELD ICON
========================================= */

function FieldIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
      {children}
    </div>
  );
}

export default function InvoiceInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ReceiptText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Invoice Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Enter the commercial and payment details for this invoice.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {/* =====================================
              INVOICE DATE
          ===================================== */}

          <FormField
            control={form.control}
            name="invoiceDate"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Invoice Date
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CalendarDays className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              EXTERNAL INVOICE NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="externalInvoiceNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  External Invoice Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Hash className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              CURRENCY
          ===================================== */}

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Currency
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CircleDollarSign className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className={selectClassName}>
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              EXCHANGE RATE
          ===================================== */}

          <FormField
            control={form.control}
            name="exchangeRate"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Exchange Rate
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <RefreshCw className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        min="0"
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              PAYMENT TERMS
          ===================================== */}

          <FormField
            control={form.control}
            name="paymentTerms"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Payment Terms
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <CreditCard className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : ""
                      }
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className={selectClassName}>
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              STATUS
          ===================================== */}

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Invoice Status
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <FileText className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={
                        typeof field.value === "string"
                          ? field.value
                          : "UNPAID"
                      }
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className={selectClassName}>
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              TRANSPORT UNITS
          ===================================== */}

          <FormField
            control={form.control}
            name="transportUnits"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Transport Units
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Scale className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              FREIGHT
          ===================================== */}

          <FormField
            control={form.control}
            name="freight"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Freight
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <WalletCards className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
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
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              INCOTERM
          ===================================== */}

          <FormField
            control={form.control}
            name="incoterm"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className={labelClassName}>
                  Incoterm
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Landmark className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="e.g. FOB"
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className={inputClassName}
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              COMMERCIAL REFERENCE
          ===================================== */}

          <FormField
            control={form.control}
            name="commercialReference"
            render={({ field }) => (
              <FormItem className="min-w-0 md:col-span-2 lg:col-span-3">
                <FormLabel className={labelClassName}>
                  Commercial Reference
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <ReceiptText className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        placeholder="Enter commercial reference number"
                        {...field}
                        value={
                          typeof field.value === "string"
                            ? field.value
                            : ""
                        }
                        className={inputClassName}
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}