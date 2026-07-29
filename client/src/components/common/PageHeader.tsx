import type { ReactNode } from "react";


interface Props {
    title: string;
    description: string;
    action?: ReactNode;
}

export default function PageHeader({
    title,
    description,
    action,
}: Props) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {title}
                </h1>

                <p className="text-muted-foreground mt-1">
                    {description}
                </p>
            </div>

            {action}
        </div>
    );
}