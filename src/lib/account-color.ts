// Old accounts may have legacy colors (purple/indigo) persisted in DB.
// This helper rewrites them at render time to the official palette without
// requiring an immediate SQL migration. See scripts/migrations/normalize-account-colors.sql
// for the eventual one-shot fix.

const BANNED_TO_APPROVED: Record<string, string> = {
  // Revolut — azul oficial alterno en lugar del violeta brand.
  "#7c3aed": "#0075EB",
  "#8b5cf6": "#0EA5E9",
  "#a78bfa": "#38BDF8",
  // Índigo default antiguo que nacía en cuentas custom.
  "#6366f1": "#6b7280",
  "#4f46e5": "#0EA5E9",
  "#818cf8": "#38BDF8",
};

export function normalizeAccountColor(color?: string | null): string {
  if (!color) return "#6b7280";
  const key = color.trim().toLowerCase();
  return BANNED_TO_APPROVED[key] ?? color;
}
