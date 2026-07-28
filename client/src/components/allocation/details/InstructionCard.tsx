import {
  ClipboardList,
  MessageSquare,
  FileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import type { Allocation } from "../../../types/allocation.types";

interface Props {
  allocation: Allocation;
}

export default function InstructionCard({
  allocation,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle className="flex items-center gap-2">

          <ClipboardList className="h-5 w-5 text-violet-600" />

          Instructions & Remarks

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        {/* Special Instructions */}

        <Section
          icon={<FileText className="h-5 w-5" />}
          title="Special Instructions"
          value={
            allocation.specialInstruction ??
            "No special instructions provided."
          }
        />

        {/* Internal Remarks */}

        <Section
          icon={<MessageSquare className="h-5 w-5" />}
          title="Internal Remarks"
          value={
            allocation.internalRemark ??
            "No internal remarks available."
          }
        />

      </CardContent>

    </Card>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function Section({
  icon,
  title,
  value,
}: SectionProps) {
  return (
    <div className="rounded-lg border p-5">

      <div className="mb-3 flex items-center gap-2">

        <div className="text-violet-600">

          {icon}

        </div>

        <h4 className="font-semibold">

          {title}

        </h4>

      </div>

      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">

        {value}

      </p>

    </div>
  );
}