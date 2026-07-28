

import { useForm } from "react-hook-form";

import type {
  Allocation,
} from "../../types/allocation.types";

import {
  useApproveAllocation,
} from "../../hooks/allocation/useApproveAllocation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../../components/ui/form";
import { Button } from "../../components/ui/button";
interface Props {

  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  allocation?: Allocation;

}

interface FormValues {

  remarks: string;

}
export default function ApproveAllocationDialog({

  open,

  onOpenChange,

  allocation,

}: Props) {

  const mutation =
    useApproveAllocation();

  const form =
    useForm<FormValues>({

      defaultValues: {

        remarks: "",

      },

    });

  if (!allocation) return null;
  const approve = (

  values: FormValues

) => {

  mutation.mutate(

    {

      id: allocation.id,

      remarks:
        values.remarks,

      status:
        "APPROVED",

    },

    {

      onSuccess() {

        onOpenChange(false);

      },

    }

  );

};
const reject = () => {

  mutation.mutate(

    {

      id: allocation.id,

      remarks:
        form.getValues(
          "remarks"
        ),

      status:
        "REJECTED",

    },

    {

      onSuccess() {

        onOpenChange(false);

      },

    }

  );

};
return (

<Dialog

open={open}

onOpenChange={onOpenChange}

>

<DialogContent className="max-w-xl">

<DialogHeader>

<DialogTitle>

Approve Allocation

</DialogTitle>

<DialogDescription>

Approve or reject this allocation request.

</DialogDescription>

</DialogHeader>

<Form {...form}>

<form

onSubmit={form.handleSubmit(
approve
)}

className="space-y-6"

>
    <div className="rounded-lg border bg-slate-50 p-4">

<p>

<strong>

Allocation

</strong>

</p>

<p>

{allocation.allocationNumber}

</p>

<p>

{allocation.client.companyName}

</p>

</div>
<FormField

control={form.control}

name="remarks"

render={({ field }) => (

<FormItem>

<FormLabel>

Remarks

</FormLabel>

<FormControl>

<textarea

placeholder="Approval comments..."

{...field}

/>

</FormControl>

</FormItem>

)}
/>
<div className="flex justify-end gap-3">

<Button

type="button"

variant="destructive"

onClick={reject}

disabled={mutation.isPending}

>

Reject

</Button>

<Button

type="submit"

disabled={mutation.isPending}

>

Approve

</Button>

</div>
</form>

</Form>

</DialogContent>

</Dialog>

);

}