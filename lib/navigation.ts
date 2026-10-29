export function safeRedirect(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u001f\u007f]/.test(value)
  )
    return "/";
  try {
    const url = new URL(value, "https://dashboard.local");
    if (
      url.origin !== "https://dashboard.local" ||
      ["/login", "/forgot-password", "/otp-verify", "/reset-password"].includes(
        url.pathname,
      )
    )
      return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}
