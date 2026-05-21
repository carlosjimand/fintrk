export function debugImport(message: string, ...args: unknown[]) {
  if (process.env.DEBUG_IMPORT !== "1") return;
  console.log(message, ...args);
}
