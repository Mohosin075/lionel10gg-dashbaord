"use client";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/lib/api-types";
export function Pagination({
  page,
  meta,
  onChange,
  disabled,
}: {
  page: number;
  meta?: PaginationMeta;
  onChange: (page: number) => void;
  disabled?: boolean;
}) {
  const totalPages = Math.max(
    1,
    meta?.totalPages ?? Math.ceil((meta?.total ?? 0) / (meta?.limit || 20)),
  );
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t text-sm">
      <span>
        {meta?.total ?? 0} records ? Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={disabled || page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={disabled || page >= totalPages}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
