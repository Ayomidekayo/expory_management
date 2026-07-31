import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";


import type {
  CreateClientDto,
} from "../../../types/client.types";
import FormSection from "../../documents/FormSection";
import FormGrid from "../../shared/FormGrid";

interface Props {
  form: UseFormReturn<CreateClientDto>;
}

export default function AddressInformation({
  form,
}: Props) {
  return (
    <FormSection
      title="Address Information"
      description="Client location and address."
    >
      <FormGrid columns={2}>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="12 Marina Road"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Lagos"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Lagos"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Nigeria"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </FormGrid>
    </FormSection>
  );
}