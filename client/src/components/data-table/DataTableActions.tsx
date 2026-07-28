

import {
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface Props {

    onView?(): void;

    onEdit?(): void;

    onDelete?(): void;
}

export default function DataTableActions({

    onView,

    onEdit,

    onDelete,

}: Props) {

    return (

        <DropdownMenu>

            <DropdownMenuTrigger asChild>

                <Button
                    variant="ghost"
                    size="icon"
                >

                    <MoreHorizontal className="h-4 w-4"/>

                </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

                <DropdownMenuItem onClick={onView}>

                    <Eye className="mr-2 h-4 w-4"/>

                    View

                </DropdownMenuItem>

                <DropdownMenuItem onClick={onEdit}>

                    <Pencil className="mr-2 h-4 w-4"/>

                    Edit

                </DropdownMenuItem>

                <DropdownMenuItem
                    className="text-red-600"
                    onClick={onDelete}
                >

                    <Trash2 className="mr-2 h-4 w-4"/>

                    Delete

                </DropdownMenuItem>

            </DropdownMenuContent>

        </DropdownMenu>

    );
}