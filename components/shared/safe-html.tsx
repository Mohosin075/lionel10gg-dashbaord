"use client";
import { sanitizeRichHtml } from "@/lib/sanitize-html";
import { useMemo, useSyncExternalStore } from "react";
const subscribe = () => () => {};
export function SafeHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const clean = useMemo(
    () => (mounted ? sanitizeRichHtml(html) : ""),
    [html, mounted],
  );
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
