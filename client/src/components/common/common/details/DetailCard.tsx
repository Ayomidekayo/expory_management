import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";


interface DetailCardProps {
  title: string;
  children: React.ReactNode;
}

export default function DetailCard({
  title,
  children,
}: DetailCardProps) {
  return (
    <Card>

      <CardHeader className="pb-3">

        <CardTitle className="text-base font-semibold">

          {title}

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">

        {children}

      </CardContent>

    </Card>
  );
}