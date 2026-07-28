import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";

interface Props {
  loading?: boolean;

  isEditing?: boolean;
}

export default function FormActions({
  loading,
  isEditing,
}: Props) {
  return (
    <div className="flex justify-end gap-4">

      <Button
        type="submit"
        disabled={loading}
      >

        {loading && (

          <Loader2 className="mr-2 h-4 w-4 animate-spin" />

        )}

        {isEditing
          ? "Update Shipment"
          : "Create Shipment"}

      </Button>

    </div>
  );
}