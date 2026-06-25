import type { FamilyData, FamilySide, FamilyVisibility } from "./types";

export function getFamilyVisibility(family: FamilyData): FamilyVisibility {
  return {
    prisca: family.visibility?.prisca !== false,
    safal: family.visibility?.safal !== false,
  };
}

export function getVisibleFamilySides(
  visibility: FamilyVisibility
): FamilySide[] {
  const sides: FamilySide[] = [];
  if (visibility.prisca) sides.push("prisca");
  if (visibility.safal) sides.push("safal");
  return sides;
}

export function normalizeFamilyVisibility(
  visibility?: Partial<FamilyVisibility>
): FamilyVisibility {
  return {
    prisca: visibility?.prisca !== false,
    safal: visibility?.safal !== false,
  };
}
