import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Building2,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  MessageSquareText,
} from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Textarea } from "../ui/textarea";

import { Button } from "../ui/button";

import type { CreateClientDto } from "../../types/client.types";

import { createClientSchema } from "../../validations/client.validation";

interface Props {
  defaultValues?: Partial<CreateClientDto>;

  loading?: boolean;

  isEditing?: boolean;

  onSubmit: (data: CreateClientDto) => void;
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
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

export default function ClientForm({
  defaultValues,
  loading = false,
  isEditing = false,
  onSubmit,
}: Props) {
  const form = useForm<CreateClientDto>({
    resolver: zodResolver(createClientSchema),

    defaultValues: {
      companyName: "",
      clientType: "COMPANY",
      contactPerson: "",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      website: "",
      taxNumber: "",
      remarks: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* =====================================================
            BASIC INFORMATION
        ===================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            icon={<Building2 className="h-5 w-5" />}
            title="Basic Information"
            description="Provide the primary information about this client."
          />

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Company Name */}

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Company Name
                    </FormLabel>

                    <div className="flex min-w-0 items-center gap-3">
                      <FieldIcon>
                        <Building2 className="h-4 w-4" />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Enter company name"
                            className="h-11 w-full border-slate-200 bg-white"
                          />
                        </FormControl>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Client Type */}

              <FormField
                control={form.control}
                name="clientType"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Client Type
                    </FormLabel>

                    <div className="flex min-w-0 items-center gap-3">
                      <FieldIcon>
                        <UserRound className="h-4 w-4" />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full border-slate-200 bg-white">
                              <SelectValue placeholder="Select client type" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="COMPANY">
                              Company
                            </SelectItem>

                            <SelectItem value="INDIVIDUAL">
                              Individual
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            placeholder="Full name"
                            className="h-11 w-full border-slate-200 bg-white"
                          />
                        </FormControl>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tax Number */}

              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Tax Number
                    </FormLabel>

                    <div className="flex min-w-0 items-center gap-3">
                      <FieldIcon>
                        <FileText className="h-4 w-4" />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Enter tax number"
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

        {/* =====================================================
            CONTACT INFORMATION
        ===================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            icon={<Phone className="h-5 w-5" />}
            title="Contact Information"
            description="Add the client's primary contact details."
          />

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="min-w-0">
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
                            placeholder="client@example.com"
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
                      Phone Number
                    </FormLabel>

                    <div className="flex min-w-0 items-center gap-3">
                      <FieldIcon>
                        <Phone className="h-4 w-4" />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="+234 800 000 0000"
                            className="h-11 w-full border-slate-200 bg-white"
                          />
                        </FormControl>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alternate Phone */}

              <FormField
                control={form.control}
                name="alternatePhone"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Alternate Phone
                    </FormLabel>

                    <div className="flex min-w-0 items-center gap-3">
                      <FieldIcon>
                        <Phone className="h-4 w-4" />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Alternative phone number"
                            className="h-11 w-full border-slate-200 bg-white"
                          />
                        </FormControl>
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Website
                    </FormLabel>

                    <div className="flex min-w-0 items-center gap-3">
                      <FieldIcon>
                        <Globe className="h-4 w-4" />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="https://example.com"
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

        {/* =====================================================
            ADDRESS INFORMATION
        ===================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            icon={<MapPin className="h-5 w-5" />}
            title="Address Information"
            description="Provide the client's business or contact address."
          />

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Country */}

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Country
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Nigeria"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      State
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Lagos"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="min-w-0">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      City
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Lagos"
                        className="h-11 w-full border-slate-200 bg-white"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="min-w-0 md:col-span-3">
                    <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                      Address
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={4}
                        placeholder="Enter full business or contact address..."
                        className="min-h-[110px] w-full resize-y border-slate-200 bg-white leading-6"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            REMARKS
        ===================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            icon={<MessageSquareText className="h-5 w-5" />}
            title="Remarks"
            description="Add any additional information about this client."
          />

          <div className="p-6">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="min-w-0">
                  <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                    Additional Notes
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={5}
                      placeholder="Enter additional notes, special instructions, or other relevant information..."
                      className="min-h-[140px] w-full resize-y border-slate-200 bg-white leading-6"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* =====================================================
            SUBMIT
        ===================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full px-8 sm:w-auto"
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Client"
              : "Create Client"}
          </Button>
        </div>
      </form>
    </Form>
  );
}