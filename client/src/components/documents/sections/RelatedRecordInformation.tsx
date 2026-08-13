import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import {
  FileText,
  Package,
  Receipt,
  Route,
  Ship,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { useShipments } from "../../../hooks/shipments/useShipments";
import { useContainers } from "../../../hooks/container/useContainers";
import { usePackingLists } from "../../../hooks/packingList/usePackingLists";
import { useTransits } from "../../../hooks/transit/useTransits";
import { useInvoices } from "../../../hooks/invoices/useInvoices";

import type {
  CreateDocumentInput,
} from "../../../validations/document.validation";

interface Props {
  form: UseFormReturn<CreateDocumentInput>;
}

export default function RelatedRecordInformation({
  form,
}: Props) {
  const shipmentId = form.watch("shipmentId");
  const attachTo = form.watch("attachTo");

  /*
  =====================================
  Load Data
  =====================================
  */

  const { data: shipments } = useShipments();

  const { data: containers } = useContainers({
    shipmentId,
  });

  const { data: packingLists } = usePackingLists({
    shipmentId,
  });

  const { data: transits } = useTransits({
    shipmentId,
  });

  const { data: invoices } = useInvoices({
    shipmentId,
  });

  /*
  =====================================
  Reset child records
  =====================================
  */

  useEffect(() => {
    if (!shipmentId) return;

    form.resetField("containerId");
    form.resetField("packingListId");
    form.resetField("transitId");
    form.resetField("invoiceId");
  }, [shipmentId, form]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Related Record
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Select the shipment, then choose what this
              document belongs to.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-4 sm:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* =================================================
              SHIPMENT
          ================================================= */}

          <FormField
            control={form.control}
            name="shipmentId"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Shipment
                </FormLabel>

                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={!!field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        border-slate-200
                        bg-white
                        shadow-sm
                        transition-all
                        hover:border-slate-300
                        focus:ring-2
                        focus:ring-blue-500/20
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                        disabled:opacity-70
                        sm:h-12
                      "
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <Ship className="h-4 w-4 shrink-0 text-blue-500" />

                        <SelectValue placeholder="Select Shipment" />
                      </div>
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent
                    position="popper"
                    align="start"
                    className="
                      z-50
                      w-[var(--radix-select-trigger-width)]
                      min-w-[var(--radix-select-trigger-width)]
                      max-w-[calc(100vw-2rem)]
                      border-slate-200
                      bg-white
                      shadow-xl
                    "
                  >
                    {shipments?.data?.map((shipment) => (
                      <SelectItem
                        key={shipment.id}
                        value={shipment.id}
                        className="
                          cursor-pointer
                          py-2.5
                          focus:bg-blue-50
                          focus:text-blue-700
                        "
                      >
                        {shipment.shipmentNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================================
              ATTACH TO
          ================================================= */}

          <FormField
            control={form.control}
            name="attachTo"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Attach To
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);

                    form.resetField("containerId");
                    form.resetField("packingListId");
                    form.resetField("transitId");
                    form.resetField("invoiceId");
                  }}
                >
                  <FormControl>
                    <SelectTrigger
                      className="
                        h-11
                        w-full
                        border-slate-200
                        bg-white
                        shadow-sm
                        transition-all
                        hover:border-slate-300
                        focus:ring-2
                        focus:ring-violet-500/20
                        sm:h-12
                      "
                    >
                      <SelectValue placeholder="Select Record Type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent
                    position="popper"
                    align="start"
                    className="
                      z-50
                      w-[var(--radix-select-trigger-width)]
                      min-w-[var(--radix-select-trigger-width)]
                      max-w-[calc(100vw-2rem)]
                      border-slate-200
                      bg-white
                      shadow-xl
                    "
                  >
                    <SelectItem
                      value="SHIPMENT"
                      className="py-2.5 focus:bg-blue-50 focus:text-blue-700"
                    >
                      <SelectOption
                        icon={
                          <Ship className="h-4 w-4 text-blue-500" />
                        }
                        label="Shipment"
                      />
                    </SelectItem>

                    <SelectItem
                      value="CONTAINER"
                      className="py-2.5 focus:bg-emerald-50 focus:text-emerald-700"
                    >
                      <SelectOption
                        icon={
                          <Package className="h-4 w-4 text-emerald-500" />
                        }
                        label="Container"
                      />
                    </SelectItem>

                    <SelectItem
                      value="PACKING_LIST"
                      className="py-2.5 focus:bg-amber-50 focus:text-amber-700"
                    >
                      <SelectOption
                        icon={
                          <FileText className="h-4 w-4 text-amber-500" />
                        }
                        label="Packing List"
                      />
                    </SelectItem>

                    <SelectItem
                      value="TRANSIT"
                      className="py-2.5 focus:bg-purple-50 focus:text-purple-700"
                    >
                      <SelectOption
                        icon={
                          <Route className="h-4 w-4 text-purple-500" />
                        }
                        label="Transit"
                      />
                    </SelectItem>

                    <SelectItem
                      value="INVOICE"
                      className="py-2.5 focus:bg-rose-50 focus:text-rose-700"
                    >
                      <SelectOption
                        icon={
                          <Receipt className="h-4 w-4 text-rose-500" />
                        }
                        label="Invoice"
                      />
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =================================================
              CONTAINER
          ================================================= */}

          {attachTo === "CONTAINER" && (
            <RelatedSelect
              form={form}
              name="containerId"
              label="Container"
              placeholder={
                shipmentId
                  ? "Select Container"
                  : "Select Shipment First"
              }
              disabled={!shipmentId}
              icon={
                <Package className="h-4 w-4 text-emerald-500" />
              }
              options={
                containers?.data?.map((container) => ({
                  id: container.id,
                  label: container.containerNumber,
                })) ?? []
              }
            />
          )}

          {/* =================================================
              PACKING LIST
          ================================================= */}

          {attachTo === "PACKING_LIST" && (
            <RelatedSelect
              form={form}
              name="packingListId"
              label="Packing List"
              placeholder={
                shipmentId
                  ? "Select Packing List"
                  : "Select Shipment First"
              }
              disabled={!shipmentId}
              icon={
                <FileText className="h-4 w-4 text-amber-500" />
              }
              options={
                packingLists?.data?.map((packing) => ({
                  id: packing.id,
                  label: packing.packingListNumber,
                })) ?? []
              }
            />
          )}

          {/* =================================================
              TRANSIT
          ================================================= */}

          {attachTo === "TRANSIT" && (
            <RelatedSelect
              form={form}
              name="transitId"
              label="Transit"
              placeholder={
                shipmentId
                  ? "Select Transit"
                  : "Select Shipment First"
              }
              disabled={!shipmentId}
              icon={
                <Route className="h-4 w-4 text-purple-500" />
              }
              options={
                transits?.data?.map((transit) => ({
                  id: transit.id,
                  label: transit.transitNumber,
                })) ?? []
              }
            />
          )}

          {/* =================================================
              INVOICE
          ================================================= */}

          {attachTo === "INVOICE" && (
            <RelatedSelect
              form={form}
              name="invoiceId"
              label="Invoice"
              placeholder={
                shipmentId
                  ? "Select Invoice"
                  : "Select Shipment First"
              }
              disabled={!shipmentId}
              icon={
                <Receipt className="h-4 w-4 text-rose-500" />
              }
              options={
                invoices?.data?.map((invoice) => ({
                  id: invoice.id,
                  label: invoice.invoiceNumber,
                })) ?? []
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

/*
=========================================================
RELATED SELECT
=========================================================
*/

interface RelatedSelectProps {
  form: UseFormReturn<CreateDocumentInput>;
  name:
    | "containerId"
    | "packingListId"
    | "transitId"
    | "invoiceId";
  label: string;
  placeholder: string;
  disabled: boolean;
  icon: React.ReactNode;
  options: {
    id: string;
    label: string;
  }[];
}

function RelatedSelect({
  form,
  name,
  label,
  placeholder,
  disabled,
  icon,
  options,
}: RelatedSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="min-w-0">
          <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
            {label}
          </FormLabel>

          <Select
            disabled={disabled}
            value={field.value ?? ""}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger
                className="
                  h-11
                  w-full
                  border-slate-200
                  bg-white
                  shadow-sm
                  transition-all
                  hover:border-slate-300
                  focus:ring-2
                  focus:ring-violet-500/20
                  disabled:cursor-not-allowed
                  disabled:bg-slate-50
                  disabled:opacity-60
                  sm:h-12
                "
              >
                <div className="flex min-w-0 items-center gap-2">
                  {icon}

                  <SelectValue placeholder={placeholder} />
                </div>
              </SelectTrigger>
            </FormControl>

            <SelectContent
              position="popper"
              align="start"
              className="
                z-50
                w-[var(--radix-select-trigger-width)]
                min-w-[var(--radix-select-trigger-width)]
                max-w-[calc(100vw-2rem)]
                border-slate-200
                bg-white
                shadow-xl
              "
            >
              {options.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-slate-500">
                  No {label.toLowerCase()} found.
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="
                      cursor-pointer
                      py-2.5
                      focus:bg-violet-50
                      focus:text-violet-700
                    "
                  >
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/*
=========================================================
SELECT OPTION
=========================================================
*/

function SelectOption({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}

      <span>{label}</span>
    </div>
  );
}