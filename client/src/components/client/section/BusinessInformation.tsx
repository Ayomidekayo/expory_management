import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import FormGrid from "../../form/FormGrid";
import FormSection from "../../form/FormSection";

import type {
  CreateClientDto,
} from "../../../types/client.types";

interface Props {
  form: UseFormReturn<CreateClientDto>;
}

export default function BusinessInformation({
  form,
}: Props) {
  return (
    <FormSection
      title="Business Information"
      description="Business registration information."
    >
      <FormGrid columns={2}>
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
                  placeholder="https://company.com"
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
          name="taxNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tax Number
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="TIN-123456789"
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