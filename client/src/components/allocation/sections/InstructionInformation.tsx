import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import FormSection from "../../form/FormSection";
import FormGrid from "../../form/FormGrid";

import type { AllocationSectionProps } from "./types";

export default function InstructionInformation({
  form,
}: AllocationSectionProps) {
  return (
    <FormSection
      title="Instructions & Remarks"
      description="Provide operational instructions and internal notes."
    >
      <FormGrid columns={2}>
        <FormField
          control={form.control}
          name="specialInstruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Special Instructions
              </FormLabel>

              <FormControl>
                <textarea
                  rows={5}
                  placeholder="Enter special instructions for this allocation..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="internalRemark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Internal Remarks
              </FormLabel>

              <FormControl>
                <textarea
                  rows={5}
                  placeholder="Internal notes (not visible to clients)..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
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