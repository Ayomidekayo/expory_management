import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import ClientForm from "./ClientForm";

import type {
  Client,
  CreateClientDto,
} from "../../types/client.types";

import { useCreateClient } from "../../hooks/client/useCreateClient";
import { useUpdateClient } from "../../hooks/client/useUpdateClient";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}

export default function ClientDialog({
  open,
  onOpenChange,
  client,
}: Props) {
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();

  const editing = !!client;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? "Edit Client"
              : "New Client"}
          </DialogTitle>
        </DialogHeader>

        <ClientForm
          defaultValues={client}
          isEditing={editing}
          loading={
            createMutation.isPending ||
            updateMutation.isPending
          }
          onSubmit={(values: CreateClientDto) => {
            if (client) {
              updateMutation.mutate(
                {
                  id: client.id,
                  payload: values,
                },
                {
                  onSuccess() {
                    toast.success(
                      "Client updated successfully."
                    );

                    onOpenChange(false);
                  },
                }
              );

              return;
            }

            createMutation.mutate(values, {
              onSuccess() {
                toast.success(
                  "Client created successfully."
                );

                onOpenChange(false);
              },
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}