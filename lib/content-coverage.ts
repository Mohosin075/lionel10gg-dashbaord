import type { ContentModule } from "./api-types";
export type ModuleCoverage = Partial<Record<`${ContentModule}Count`, number>> &
  Partial<Record<`${ContentModule}Pack`, unknown>>;
export function getModuleCount(
  coverage: ModuleCoverage | undefined,
  module: ContentModule,
): number {
  return coverage?.[`${module}Count`] ?? 0;
}
export function hasModuleContent(
  coverage: ModuleCoverage | undefined,
  module: ContentModule,
): boolean {
  return (
    getModuleCount(coverage, module) > 0 || Boolean(coverage?.[`${module}Pack`])
  );
}
