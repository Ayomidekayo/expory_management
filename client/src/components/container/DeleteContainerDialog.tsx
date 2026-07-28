import DeleteDialog from "../common/DeleteDialog";

import { toast } from "sonner";

import {
  useDeleteContainer,
} from "../../hooks/container/useContainers";

interface Props {
  id?: string;

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;
}

export default function DeleteContainerDialog({
  id,
  open,
  onOpenChange,
}: Props) {
  const mutation =
    useDeleteContainer();

  const handleDelete = () => {
    if (!id) return;

    mutation.mutate(id, {
      onSuccess() {
        toast.success(
          "Container deleted successfully."
        );

        onOpenChange(false);
      },

      onError(error: any) {
        toast.error(
          error.response?.data?.message ??
            "Unable to delete container."
        );
      },
    });
  };

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={mutation.isPending}
      title="Delete Container"
      description="Are you sure you want to delete this container? This action cannot be undone."
      onConfirm={handleDelete}
    />
  );
}