import { Inbox } from "lucide-react";

interface Props {
    title: string;
    description: string;
}

export default function EmptyState({
    title,
    description,
}: Props) {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
            <Inbox className="mb-4 h-14 w-14 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
                {title}
            </h2>

            <p className="mt-2 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}