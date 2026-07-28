import type { UseFormReturn } from "react-hook-form";

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

import FormSection from "../../form/FormSection";
import FormGrid from "../../form/FormGrid";

import type {
  CreateClientDto,
} from "../../../types/client.types";

interface Props {
  form: UseFormReturn<CreateClientDto>;
}

export default function CompanyInformation({
  form,
}: Props) {
  return (
    <FormSection
      title="Company Information"
      description="Basic client information."
    >
      <FormGrid columns={2}>
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
                  placeholder="ABC Limited"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

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
      </FormGrid>
    </FormSection>
  );
}