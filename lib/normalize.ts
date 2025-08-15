export function stripDiacritics(input: string): string {
  if (!input) return ""
  // Normalize and remove diacritics; handle Vietnamese đ/Đ
  return input
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function normalizeVNName(input: string): string {
  return stripDiacritics(input)
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export function namesMatch(a: string, b: string): boolean {
  return normalizeVNName(a) === normalizeVNName(b)
}
