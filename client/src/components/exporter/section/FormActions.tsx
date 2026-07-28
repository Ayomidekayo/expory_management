import { Loader2 } from "lucide-react";

import { Button } from "../../ui/button";

interface Props {
  isLoading: boolean;

  isEdit?: boolean;

  onCancel: () => void;
}

export default function FormActions({
  isLoading,
  isEdit = false,
  onCancel,
}: Props) {
  return (
    <div className="sticky bottom-0 rounded-xl border bg-white p-6 shadow-lg">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="font-semibold">
            Ready to save?
          </h3>

          <p className="text-sm text-slate-500">
            Review the exporter information before submitting.
          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="secondary"
          >
            Save Draft
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isEdit
              ? "Update Exporter"
              : "Create Exporter"}
          </Button>

        </div>

      </div>

    </div>
  );
}