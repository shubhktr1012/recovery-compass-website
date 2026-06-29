import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  description,
  title = "No data yet",
}: {
  description: string;
  title?: string;
}) {
  return (
    <Card className="border-dashed border-white/15 bg-white/[0.03] text-white shadow-none">
      <CardContent className="flex min-h-48 flex-col items-center justify-center p-8 text-center">
        <Alert className="max-w-sm border-none bg-transparent p-0 text-center shadow-none">
          <AlertCircle className="mx-auto mb-4 size-5 text-amber-100" />
          <AlertTitle className="text-base font-semibold text-white">{title}</AlertTitle>
          <AlertDescription className="mt-2 text-sm leading-6 text-white/55">
            {description}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
