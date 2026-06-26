export type VariantCombination = {
  color: string;
  gender: string;
  size: string;
};

export function normalizeVariantValue(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizeVariantCombination<T extends VariantCombination>(variant: T): T {
  return {
    ...variant,
    color: normalizeVariantValue(variant.color),
    gender: normalizeVariantValue(variant.gender),
    size: normalizeVariantValue(variant.size),
  };
}

export function getVariantCombinationKey(variant: VariantCombination) {
  const normalized = normalizeVariantCombination(variant);
  return `${normalized.gender}::${normalized.color}::${normalized.size}`.toLocaleLowerCase();
}

export function findDuplicateVariantKey<T extends VariantCombination>(variants: T[]) {
  const seen = new Set<string>();

  for (const variant of variants) {
    const key = getVariantCombinationKey(variant);
    if (seen.has(key)) return key;
    seen.add(key);
  }

  return null;
}

export function uniqueVariantValues<T extends string>(values: T[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = normalizeVariantValue(value).toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
