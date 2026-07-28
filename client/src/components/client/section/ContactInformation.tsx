import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";

import FormSection from "../../form/FormSection";
import FormGrid from "../../form/FormGrid";

import type {
  CreateClientDto,
} from "../../../types/client.types";

interface Props {
  form: UseFormReturn<CreateClientDto>;
}

export default function ContactInformation({
  form,
}: Props) {
  return (
    <FormSection
      title="Contact Information"
      description="Primary contact details."
    >
      <FormGrid columns={2}>
        {[
          {
            name: "contactPerson",
            label: "Contact Person",
          },
          {
            name: "email",
            label: "Email",
          },
          {
            name: "phone",
            label: "Phone",
          },
          {
            name: "alternatePhone",
            label: "Alternate Phone",
          },
        ].map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {item.label}
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
        ))}
      </FormGrid>
    </FormSection>
  );
}