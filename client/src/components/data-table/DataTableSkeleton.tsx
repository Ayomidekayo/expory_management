export default function DataTableSkeleton() {
    return (
        <div className="rounded-xl border bg-white p-5 space-y-4">
            {[...Array(8)].map((_, index) => (
                <div
                    key={index}
                    className="h-12 animate-pulse rounded bg-muted"
                />
            ))}
        </div>
    );
}