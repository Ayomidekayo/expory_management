import type { UseFormReturn } from "react-hook-form";

import {
  FileCheck2,
  FileText,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import type { CreateShipmentInput } from "../../../validations/shipment.validation";

interface Props {
  form: UseFormReturn<CreateShipmentInput>;
}

function DocumentIcon() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
      <FileText className="h-4 w-4" />
    </div>
  );
}

export default function ExportDocuments({
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
            <FileCheck2 className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Export Documents
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the reference numbers for the shipment's
              export documentation.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* =====================================
              XF NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="xfNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  XF Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <DocumentIcon />

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="XF-2026-0001"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              NXP NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="nxpNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  NXP Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <DocumentIcon />

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="NXP-2026-0001"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              CCI NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="cciNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  CCI Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <DocumentIcon />

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="CCI-2026-0001"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              E NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="eNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  E Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <DocumentIcon />

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="E-2026-0001"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* =========================================
            INFORMATION PANEL
        ========================================= */}

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FileCheck2 className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">
              Document References
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter the applicable export document reference
              numbers. Leave a field blank if the document is
              not applicable to this shipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}