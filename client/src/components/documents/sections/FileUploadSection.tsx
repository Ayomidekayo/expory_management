import { UploadCloud, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { Button } from "../../ui/button";

import type {
  CreateDocumentInput,
} from "../../../validations/document.validation";

interface Props {
  form: UseFormReturn<CreateDocumentInput>;
}

export default function FileUploadSection({
  form,
}: Props) {
  const file = form.watch("file");

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Upload File
        </h2>

        <p className="text-sm text-muted-foreground">
          Upload the supporting document.
        </p>
      </div>

      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Document
            </FormLabel>

            <FormControl>
              <label
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border-2
                  border-dashed
                  border-muted
                  p-10
                  transition
                  hover:border-primary
                "
              >
                <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />

                <span className="font-medium">
                  Click to upload
                </span>

                <span className="mt-1 text-sm text-muted-foreground">
                  PDF, Word, Excel or Image
                </span>

                <input
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const selected =
                      e.target.files?.[0];

                    if (!selected) return;

                    form.setValue(
                      "file",
                      selected,
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      }
                    );
                  }}
                />
              </label>
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      {file && (
        <div className="mt-6 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {file.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() =>
                form.setValue(
                  "file",
                  undefined as any,
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  }
                )
              }
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}