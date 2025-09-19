import type { LabelObj } from "@/types/account";

/**
 *  Преобразуем строку меток, разделенных запятыми, в массив объектов меток.
 */
export function parseLabels(input: string): LabelObj[] {
  return input
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

/**
 * Преобразуем массив объектов меток в строку
 * @param labels - массив объектов меток
 */
export function stringifyLabels(labels: LabelObj[]): string {
  return labels.map((label) => label.text).join(", ");
}
