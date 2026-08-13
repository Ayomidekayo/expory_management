import type { UseFormReturn } from "react-hook-form";

import {
  Box,
  Hash,
  LockKeyhole,
  Ruler,
  ShieldCheck,
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

import { Input } from "../../ui/input";

import type {
  CreateContainerInput,
} from "../../../validations/container.validation";

interface Props {
  form: UseFormReturn<CreateContainerInput>;
}

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

export default function ContainerInformation({
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
            <Box className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Container Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Basic information about the shipping
              container.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM CONTENT
      ========================================= */}

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* =====================================
              CONTAINER NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="containerNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Container Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Hash className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="e.g. MSKU1234567"
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
              SEAL NUMBER
          ===================================== */}

          <FormField
            control={form.control}
            name="sealNumber"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Seal Number
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <LockKeyhole className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter seal number"
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
              CONTAINER TYPE
          ===================================== */}

          <FormField
            control={form.control}
            name="containerType"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Container Type
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Box className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="DRY">
                          Dry
                        </SelectItem>

                        <SelectItem value="REEFER">
                          Reefer
                        </SelectItem>

                        <SelectItem value="OPEN_TOP">
                          Open Top
                        </SelectItem>

                        <SelectItem value="FLAT_RACK">
                          Flat Rack
                        </SelectItem>

                        <SelectItem value="TANK">
                          Tank
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* =====================================
              CONTAINER SIZE
          ===================================== */}

          <FormField
            control={form.control}
            name="containerSize"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Container Size
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Ruler className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="FT20">
                          20 FT
                        </SelectItem>

                        <SelectItem value="FT40">
                          40 FT
                        </SelectItem>

                        <SelectItem value="FT40_HC">
                          40 FT High Cube
                        </SelectItem>

                        <SelectItem value="FT45">
                          45 FT
                        </SelectItem>
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
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <ShieldCheck className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="EMPTY">
                          Empty
                        </SelectItem>

                        <SelectItem value="LOADED">
                          Loaded
                        </SelectItem>

                        <SelectItem value="IN_TRANSIT">
                          In Transit
                        </SelectItem>

                        <SelectItem value="DELIVERED">
                          Delivered
                        </SelectItem>
                      </SelectContent>
                    </Select>
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