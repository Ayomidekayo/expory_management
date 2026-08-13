import { Loader2, Save } from "lucide-react";
import { Button } from "../../ui/button";


interface Props {
  isEditing?: boolean;
  loading?: boolean;
}

export default function FormActions({
  isEditing = false,
  loading = false,
}: Props) {
  return (
    <div className="flex justify-end gap-4 border-t pt-6">

      <Button
        type="submit"
        disabled={loading}
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
              ? "Update container"
              : "Create container"}
          </>
        )}
      </Button>

    </div>
  );
}