export function getErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;
  if (
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  )
    return error.data.message;
  if ("message" in error && typeof error.message === "string")
    return error.message;
  return fallback;
}
