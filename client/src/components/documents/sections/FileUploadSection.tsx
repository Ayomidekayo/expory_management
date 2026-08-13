import {
  CheckCircle2,
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

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

  const removeFile = () => {
    form.setValue("file", undefined as any, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <UploadCloud className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Upload File
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Upload the supporting document for this record.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-4 sm:p-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-2 block text-sm font-medium text-slate-700">
                Document
              </FormLabel>

              <FormControl>
                <label
                  htmlFor="document-file-upload"
                  className="
                    group
                    flex
                    min-h-[220px]
                    w-full
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-xl
                    border-2
                    border-dashed
                    border-slate-200
                    bg-slate-50/50
                    px-4
                    py-8
                    text-center
                    transition-all
                    duration-200
                    hover:border-emerald-400
                    hover:bg-emerald-50/40
                    sm:min-h-[240px]
                    sm:px-6
                  "
                >
                  <div
                    className="
                      mb-4
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-50
                      text-emerald-600
                      transition-transform
                      group-hover:scale-105
                    "
                  >
                    <UploadCloud className="h-7 w-7" />
                  </div>

                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    Click to upload a document
                  </span>

                  <span className="mt-1 text-sm text-slate-500">
                    or choose a file from your device
                  </span>

                  <span className="mt-4 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                    PDF · Word · Excel · Images
                  </span>

                  <span className="mt-3 text-xs text-slate-400">
                    Supported: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG
                  </span>

                  <input
                    id="document-file-upload"
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    ref={field.ref}
                    name={field.name}
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

              <FormMessage className="mt-2" />
            </FormItem>
          )}
        />

        {/* =====================================================
            SELECTED FILE
        ====================================================== */}

        {file && (
          <div className="mt-6 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-center gap-3">
                {/* File icon */}

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                  <FileIcon file={file} />
                </div>

                {/* File information */}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="truncate text-sm font-semibold text-slate-900"
                      title={file.name}
                    >
                      {file.name}
                    </p>

                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                    <span>
                      {formatFileSize(file.size)}
                    </span>

                    <span className="text-slate-300">
                      •
                    </span>

                    <span>
                      {formatFileType(file.name)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Remove */}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeFile}
                className="
                  shrink-0
                  border-red-200
                  bg-white
                  text-red-600
                  hover:border-red-300
                  hover:bg-red-50
                  hover:text-red-700
                "
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
=========================================================
FILE ICON
=========================================================
*/

function FileIcon({
  file,
}: {
  file: File;
}) {
  const extension =
    file.name.split(".").pop()?.toLowerCase();

  if (
    ["jpg", "jpeg", "png"].includes(
      extension ?? ""
    )
  ) {
    return <FileImage className="h-5 w-5" />;
  }

  if (
    ["xls", "xlsx"].includes(
      extension ?? ""
    )
  ) {
    return (
      <FileSpreadsheet className="h-5 w-5" />
    );
  }

  if (
    ["pdf", "doc", "docx"].includes(
      extension ?? ""
    )
  ) {
    return <FileText className="h-5 w-5" />;
  }

  return <File className="h-5 w-5" />;
}

/*
=========================================================
FILE SIZE
=========================================================
*/

function formatFileSize(
  size: number
) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(
    size /
    1024 /
    1024
  ).toFixed(2)} MB`;
}

/*
=========================================================
FILE TYPE
=========================================================
*/

function formatFileType(
  fileName: string
) {
  const extension =
    fileName
      .split(".")
      .pop()
      ?.toUpperCase();

  return extension
    ? `${extension} file`
    : "Document";
}