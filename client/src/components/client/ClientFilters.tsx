import { Search } from "lucide-react";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ClientFilters() {
  return (
    <div className="rounded-lg border bg-background p-4">

      <div className="grid gap-4 lg:grid-cols-4">

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search clients..."
            className="pl-9"
          />

        </div>

        <Select>

          <SelectTrigger>

            <SelectValue placeholder="Client Type" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All Types
            </SelectItem>

            <SelectItem value="COMPANY">
              Company
            </SelectItem>

            <SelectItem value="INDIVIDUAL">
              Individual
            </SelectItem>

          </SelectContent>

        </Select>

        <Select>

          <SelectTrigger>

            <SelectValue placeholder="Status" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="active">
              Active
            </SelectItem>

            <SelectItem value="inactive">
              Inactive
            </SelectItem>

          </SelectContent>

        </Select>

        <Select>

          <SelectTrigger>

            <SelectValue placeholder="Country" />

          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">
              All Countries
            </SelectItem>

            {/* Dynamic countries later */}

          </SelectContent>

        </Select>

      </div>

    </div>
  );
}