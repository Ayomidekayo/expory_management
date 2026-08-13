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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <DocumentIcon />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Document Information
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Select the type of document you want to upload.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full max-w-xl">
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Document Type
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger
                    className="
                      h-11
                      w-full
                      border-slate-200
                      bg-white
                      px-3
                      text-sm
                      shadow-sm
                      transition-all
                      hover:border-slate-300
                      focus:ring-2
                      focus:ring-blue-500/20
                      sm:h-12
                    "
                  >
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent
                  position="popper"
                  align="start"
                  className="
                    z-50
                    w-[var(--radix-select-trigger-width)]
                    min-w-[var(--radix-select-trigger-width)]
                    max-w-[calc(100vw-2rem)]
                    border-slate-200
                    bg-white
                    shadow-lg
                  "
                >
                  {Object.values(DocumentType).map(
                    (type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="
                          cursor-pointer
                          py-2.5
                          text-sm
                          focus:bg-blue-50
                          focus:text-blue-700
                        "
                      >
                        {formatDocumentType(type)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <FormMessage className="mt-2" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

/*
=====================================
Document Icon
=====================================
*/

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

/*
=====================================
Helper
=====================================
*/

function formatDocumentType(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}