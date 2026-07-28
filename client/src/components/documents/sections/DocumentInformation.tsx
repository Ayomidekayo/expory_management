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

import type {
  CreateDocumentInput,
} from "../../../validations/document.validation";

import { DocumentType } from "../../../types/enums";

interface Props {
  form: UseFormReturn<CreateDocumentInput>;
}

export default function DocumentInformation({
  form,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Document Information
        </h2>

        <p className="text-sm text-muted-foreground">
          Select the type of document you want to upload.
        </p>

      </div>

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>

            <FormLabel>
              Document Type
            </FormLabel>

            <Select
              value={field.value}
              onValueChange={field.onChange}
            >

              <FormControl>

                <SelectTrigger>

                  <SelectValue placeholder="Select Document Type" />

                </SelectTrigger>

              </FormControl>

              <SelectContent>

                {Object.values(DocumentType).map(
                  (type) => (

                    <SelectItem
                      key={type}
                      value={type}
                    >
                      {formatDocumentType(type)}
                    </SelectItem>

                  )
                )}

              </SelectContent>

            </Select>

            <FormMessage />

          </FormItem>
        )}
      />

    </div>
  );
}

/*
=====================================
Helper
=====================================
*/

function formatDocumentType(
  value: string
) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}

