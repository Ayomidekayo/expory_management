import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import {
  useCreateContainer,
  useUpdateContainer,
} from "../../hooks/container/useContainers";

import type { Container, CreateContainerDto } from "../../types/container.type";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  container?: Container;
}

export default function ContainerDialog({
  open,
  onOpenChange,
  container,
}: Props) {
  const createMutation = useCreateContainer();

  const updateMutation = useUpdateContainer();

  const editing = !!container;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Container" : "New Container"}
          </DialogTitle>
        </DialogHeader>

        <ContainerForm
          defaultValues={container}
          loading={createMutation.isPending || updateMutation.isPending}
          onSubmit={(values: CreateContainerDto) => {
            if (editing) {
              updateMutation.mutate(
                {
                  id: container.id,
                  data: values,
                },
                {
                  onSuccess() {
                    toast.success("Container updated successfully.");

                    onOpenChange(false);
                  },

                  onError(error: any) {
                    toast.error(
                      error?.response?.data?.message ??
                        "Unable to update container.",
                    );
                  },
                },
              );

              return;
            }

            createMutation.mutate(values, {
              onSuccess() {
                toast.success("Container created successfully.");

                onOpenChange(false);
              },

              onError(error: any) {
                toast.error(
                  error?.response?.data?.message ??
                    "Unable to create container.",
                );
              },
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
