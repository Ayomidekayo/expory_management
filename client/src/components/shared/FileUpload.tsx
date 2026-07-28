import { Upload, FileText, X } from "lucide-react";
import { Button } from "../ui/button";
interface Props {
  value?: File;

  onChange: (file?: File) => void;

  accept?: string;

  maxSize?: number;

  disabled?: boolean;

  required?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10,
  disabled = false,
}: Props) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const sizeMB =
      file.size / (1024 * 1024);

    if (sizeMB > maxSize) {
      alert(
        `Maximum file size is ${maxSize} MB`
      );
      return;
    }

    onChange(file);
  }

  return (
    <div className="space-y-4">

      <label
        className="
          flex
          flex-col
          items-center
          justify-center
          rounded-xl
          border-2
          border-dashed
          p-8
          cursor-pointer
          hover:bg-muted/40
          transition
        "
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-3" />

        <p className="font-medium">
          Click to upload
        </p>

        <p className="text-sm text-muted-foreground">
          PDF, DOC, DOCX, JPG, PNG
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Maximum {maxSize} MB
        </p>

        <input
          hidden
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
        />
      </label>

      {value && (
        <div
          className="
            rounded-lg
            border
            p-4
            flex
            justify-between
            items-center
          "
        >
          <div className="flex items-center gap-3">

            <FileText className="h-5 w-5" />

            <div>

              <p className="font-medium">
                {value.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {(
                  value.size /
                  1024 /
                  1024
                ).toFixed(2)}
                {" MB"}
              </p>

            </div>

          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onChange(undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}