
import type { AllocationSectionProps } from "../../../types/allocation.types";
import FormSection from "../../documents/FormSection";
import FormGrid from "../../shared/FormGrid";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";


export default function CargoInformation({
  form,
}: AllocationSectionProps) {
  return (
    <FormSection
      title="Cargo Information"
      description="Provide detailed information about the cargo."
    >
      <FormGrid columns={2}>
        <FormField
  control={form.control}
  name="cargoDescription"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Cargo Description</FormLabel>

      <FormControl>
        <textarea
          rows={4}
          placeholder="Describe the cargo"
          value={field.value ?? ""}
          onChange={(e) => {
            console.log("Typing:", e.target.value);
            field.onChange(e.target.value);
          }}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
          className="w-full rounded-md border p-2"
        />
      </FormControl>

      <FormMessage />
    </FormItem>
  )}
/>

        <FormField
          control={form.control}
          name="cargoType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo Type</FormLabel>

              <FormControl>
                <Input
                  placeholder="Finished Goods"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commodityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commodity Name</FormLabel>

              <FormControl>
                <Input
                  placeholder="Sesame Seeds"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commodityCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HS Code</FormLabel>

              <FormControl>
                <Input
                  placeholder="120740"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  placeholder="1000"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Type</FormLabel>

              <FormControl>
                <Input
                  placeholder="Bags"
                  {...field}
                  value={
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfPackages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Packages</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  placeholder="500"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grossWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gross Weight (KG)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="25000"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="netWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Net Weight (KG)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="24800"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume (m³)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="20"
                  value={
                    field.value == null
                      ? ""
                      : String(field.value)
                  }
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value)
                    )
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
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