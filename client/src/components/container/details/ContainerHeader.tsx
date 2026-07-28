import {
  Package,
  BadgeCheck,
} from "lucide-react";
import type { Container } from "../../../types/container.type";
import { Badge } from "../../ui/badge";

interface Props {
  container: Container;
}

export default function ContainerHeader({
  container,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">

      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3">

            <Package className="h-8 w-8 text-primary" />

            <div>

              <h1 className="text-3xl font-bold">

                {container.containerNumber}

              </h1>

              <p className="text-muted-foreground">

                Shipping Container

              </p>

            </div>

          </div>

        </div>

        <Badge className="text-sm px-4 py-2">

          <BadgeCheck className="mr-2 h-4 w-4" />

          {container.status}

        </Badge>

      </div>

    </div>
  );
}