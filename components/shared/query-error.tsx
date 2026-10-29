"use client";
import { Button } from "@/components/ui/button";
export function QueryError({
  retry,
  message = "Could not load data. Check your connection and try again.",
}: {
  retry: () => void;
  message?: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-center justify-between gap-4"
    >
      <span>{message}</span>
      <Button variant="outline" onClick={retry}>
        Retry
      </Button>
    </div>
  );
}
