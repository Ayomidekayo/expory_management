import { Search } from "lucide-react";

import { Input } from "../ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  search: string;
  clientType: string;
  status: string;
  country: string;
  countries: string[];

  onSearchChange: (value: string) => void;
  onClientTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCountryChange: (value: string) => void;
}

export default function ClientFilters({
  search,
  clientType,
  status,
  country,
  countries,
  onSearchChange,
  onClientTypeChange,
  onStatusChange,
  onCountryChange,
}: Props) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="grid gap-4 lg:grid-cols-4">

        {/* Search */}

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="pl-9"
          />
        </div>

        {/* Client Type */}

        <Select
          value={clientType}
          onValueChange={onClientTypeChange}
        >
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

        {/* Status */}

        <Select
          value={status}
          onValueChange={onStatusChange}
        >
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

        {/* Country */}

        <Select
          value={country}
          onValueChange={onCountryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Countries
            </SelectItem>

            {countries.map((item) => (
              <SelectItem
                key={item}
                value={item}
              >
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}