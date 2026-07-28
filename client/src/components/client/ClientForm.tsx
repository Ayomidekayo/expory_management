import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Button } from "../ui/button";
import type { CreateClientDto } from "../../types/client.types";
import { createClientSchema } from "../../validations/client.validation";


interface Props {
  defaultValues?: Partial<CreateClientDto>;

  loading?: boolean;

  isEditing?: boolean;

  onSubmit: (
    data: CreateClientDto
  ) => void;
}

export default function ClientForm({
  defaultValues,
  loading = false,
  isEditing = false,
  onSubmit,
}: Props) {
  const form =
    useForm<CreateClientDto>({
      resolver: zodResolver(
        createClientSchema
      ),

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
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Company */}

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company Name
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Company Name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}

          <FormField
            control={form.control}
            name="clientType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Client Type
                </FormLabel>

                <Select
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact */}

          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Contact Person
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email
                </FormLabel>

                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Alternate Phone */}

          <FormField
            control={form.control}
            name="alternatePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Alternate Phone
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Country
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
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
              <FormItem>
                <FormLabel>
                  State
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
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
              <FormItem>
                <FormLabel>
                  City
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Website */}

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Website
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tax */}

          <FormField
            control={form.control}
            name="taxNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tax Number
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    value={
                      field.value ?? ""
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* Address */}

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address
              </FormLabel>

              <FormControl>
                <textarea
                  rows={3}
                  {...field}
                  value={
                    field.value ?? ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remarks */}

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Remarks
              </FormLabel>

              <FormControl>
                <textarea
                  rows={4}
                  {...field}
                  value={
                    field.value ?? ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Client"
            : "Create Client"}
        </Button>
      </form>
    </Form>
  );
}