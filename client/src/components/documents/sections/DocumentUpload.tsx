import { Upload, X, FileText } from "lucide-react";

import { Button } from "../../ui/button";

import { useState } from "react";
import type { AllocationSectionProps } from "../../../types/allocation.types";
import FormSection from "../FormSection";



export default function DocumentUpload({
  form: _form,
}: AllocationSectionProps) {
  const [files, setFiles] = useState<File[]>([]);

const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  if (!e.target.files) return;

  const selectedFiles = Array.from(e.target.files);

  setFiles((prev) => {
    const existingNames = new Set(
      prev.map((f) => f.name)
    );

    const newFiles = selectedFiles.filter(
      (file) => !existingNames.has(file.name)
    );

    return [...prev, ...newFiles];
  });

  e.target.value = "";
};
const removeFile = (index: number) => {

  setFiles((prev) =>
    prev.filter((_, i) => i !== index)
  );

};
return (

<FormSection
    title="Supporting Documents"
    description="Upload invoices, permits, certificates and other supporting documents."
>

<div className="space-y-6">
    <label
  className="
      flex
      cursor-pointer
      flex-col
      items-center
      justify-center
      rounded-xl
      border-2
      border-dashed
      border-slate-300
      p-12
      transition
      hover:border-emerald-500
      hover:bg-emerald-50
  "
>

<Upload
    className="mb-4 text-slate-400"
    size={48}
/>

<h3 className="font-semibold">

Upload Documents

</h3>

<p className="mt-2 text-sm text-slate-500">

Click or drag files here

</p>

<input

type="file"

multiple

className="hidden"

onChange={handleFileChange}

/>

</label>
<div className="space-y-3">

{files.map((file, index)=>(

<div

key={index}

className="flex items-center justify-between rounded-lg border p-4"

>

<div className="flex items-center gap-3">

<FileText
size={20}
className="text-blue-600"
/>

<div>

<p className="font-medium">

{file.name}

</p>

<p className="text-sm text-slate-500">

{(file.size/1024).toFixed(2)} KB

</p>

</div>

</div>
<Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => removeFile(index)}
>
  <X size={18} />
</Button>

</div>

))}

</div>
<div className="rounded-lg bg-slate-100 p-4">

<p className="font-medium">

Accepted Files

</p>

<ul className="mt-2 list-disc pl-6 text-sm text-slate-600">

<li>PDF</li>

<li>Word (.doc, .docx)</li>

<li>Excel (.xls, .xlsx)</li>

<li>Images (.png, .jpg)</li>

<li>Maximum 10MB each</li>

</ul>

</div>
</div>

</FormSection>

);
}