import type { UseFormReturn } from "react-hook-form";

import {
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import type { CreateConsigneeInput } from "../../../validations/consignee.validation";

interface Props {
  form: UseFormReturn<CreateConsigneeInput>;
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

export default function ContactInformation({
  form,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Contact Information
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Provide the primary contact details for the consignee.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Contact Person */}
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Contact Person
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <UserRound className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter contact person"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Phone className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter phone number"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="min-w-0 md:col-span-2 md:max-w-2xl">
                <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </FormLabel>

                <div className="flex min-w-0 items-center gap-3">
                  <FieldIcon>
                    <Mail className="h-4 w-4" />
                  </FieldIcon>

                  <div className="min-w-0 flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter email address"
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
      </div>
    </div>
  );
}