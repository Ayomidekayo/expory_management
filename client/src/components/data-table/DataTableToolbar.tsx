import type { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";


interface Props<TData> {

    table: Table<TData>;
}

export function DataTableToolbar<TData>({
    table,
}: Props<TData>) {

    return (

        <div className="flex items-center py-4">

            <Input

                placeholder="Search..."

                value={
                    (table
                        .getColumn("name")
                        ?.getFilterValue() as string) ?? ""
                }

                onChange={(event) =>
                    table
                        .getColumn("name")
                        ?.setFilterValue(
                            event.target.value
                        )
                }

                className="max-w-sm"

            />

        </div>

    );
}