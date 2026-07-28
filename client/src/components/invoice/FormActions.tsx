import { Loader2, Save } from "lucide-react";

import { Button } from "../ui/button";

interface Props {
  isEditing?: boolean;

  loading?: boolean;
}

export default function FormActions({
  isEditing = false,
  loading = false,
}: Props) {
  return (
    <div className="sticky bottom-0 rounded-xl border bg-white p-6 shadow-sm">

      <div className="flex justify-end">

        <Button
          type="submit"
          disabled={loading}
          size="lg"
        >
          {loading ? (
            <>

              <Loader2 className="mr-2 h-4 w-4 animate-spin" />

              {isEditing
                ? "Updating..."
                : "Creating..."}

            </>
          ) : (
            <>

              <Save className="mr-2 h-4 w-4" />

              {isEditing
                ? "Update Invoice"
                : "Create Invoice"}

            </>
          )}

        </Button>

      </div>

    </div>
  );
}