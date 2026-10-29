"use client";
import { APP_LANGUAGES } from "@/lib/constants/languages";
export function LanguageSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      Language
      <select
        aria-label="Content language"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border bg-white px-2"
      >
        {APP_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name} ({language.code})
          </option>
        ))}
      </select>
    </label>
  );
}
