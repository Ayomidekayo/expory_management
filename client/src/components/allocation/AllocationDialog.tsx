// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "../ui/dialog";

// import AllocationForm from "./AllocationForm";

// import type { Allocation } from "../../types/allocation.types";

// interface AllocationDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   allocation?: Allocation;
// }

// export default function AllocationDialog({
//   open,
//   onOpenChange,
//   allocation,
// }: AllocationDialogProps) {
//   const isEdit = !!allocation;

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={onOpenChange}
      
//     >
//       <DialogContent className="max-w max-h-[95vh] overflow-y-auto">

//         <DialogHeader>

//           <DialogTitle>
//             {isEdit
//               ? "Edit Allocation"
//               : "Create New Allocation"}
//           </DialogTitle>

//           <DialogDescription>
//             {isEdit
//               ? "Update the allocation details below."
//               : "Fill in the details below to create a new export allocation."}
//           </DialogDescription>

//         </DialogHeader>

//         <AllocationForm
//           allocation={allocation}
//         />

//       </DialogContent>
//     </Dialog>
//   );
// }

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import AllocationForm from "./AllocationForm";

import type { Allocation } from "../../types/allocation.types";

interface AllocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation?: Allocation;
}

export default function AllocationDialog({
  open,
  onOpenChange,
  allocation,
}: AllocationDialogProps) {
  const isEdit = !!allocation;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
     <DialogContent
  className="
    max-w-7xl
    h-[92vh]
    overflow-y-auto
    overflow-x-hidden
    p-8
  "
>
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl">
              {isEdit
                ? "Edit Allocation"
                : "Create New Allocation"}
            </DialogTitle>

            <DialogDescription>
              {isEdit
                ? "Update the allocation details below."
                : "Fill in the details below to create a new export allocation."}
            </DialogDescription>
          </DialogHeader>

          <AllocationForm
            allocation={allocation}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}