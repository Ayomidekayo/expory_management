

import { useForm } from "react-hook-form";

import type {
  Allocation,
} from "../../types/allocation.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Button } from "../../components/ui/button";
import { useAssignOfficer } from "../../hooks/allocation/useAssignOfficer";
import { useUsers } from "../../hooks/user/useUsers";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation?: Allocation;
}

interface FormValues {
  assignedToId: string;
}
export default function AssignOfficerDialog({

  open,

  onOpenChange,

  allocation,

}: Props) {

  const { data } = useUsers();

  const users = data?.data ?? [];

  const mutation =
    useAssignOfficer();

  const form =
    useForm<FormValues>({

      defaultValues: {

        assignedToId:
          allocation?.assignedTo?.id ?? "",

      },

    });
    const onSubmit = (

  values: FormValues

) => {

  if (!allocation) return;

  mutation.mutate(

    {

      id: allocation.id,

      assignedToId:
        values.assignedToId,

    },

    {

      onSuccess() {

        onOpenChange(false);

      },

    }

  );

};
if (!allocation) return null;

return (

<Dialog

open={open}

onOpenChange={onOpenChange}

>

<DialogContent className="max-w-lg">

<DialogHeader>

<DialogTitle>

Assign Officer

</DialogTitle>

</DialogHeader>

<Form {...form}>

<form

onSubmit={form.handleSubmit(
onSubmit
)}

className="space-y-6"

>
    <FormField

control={form.control}

name="assignedToId"

render={({ field }) => (

<FormItem>

<FormLabel>

Officer

</FormLabel>

<Select

value={field.value}

onValueChange={field.onChange}

>

<FormControl>

<SelectTrigger>

<SelectValue
placeholder="Select Officer"
/>

</SelectTrigger>

</FormControl>

<SelectContent>

{users

.filter(

(user) =>
user.role ===
"OFFICER"

)

.map((user) => (

<SelectItem

key={user.id}

value={user.id}

>

{user.name}

</SelectItem>

))}

</SelectContent>

</Select>

<FormMessage />

</FormItem>

)}
/>
<div className="flex justify-end gap-3">

<Button

type="button"

variant="outline"

onClick={() =>
onOpenChange(false)
}

>

Cancel

</Button>

<Button

type="submit"

disabled={
mutation.isPending
}

>

Assign Officer

</Button>

</div>
</form>

</Form>

</DialogContent>

</Dialog>

);

}
