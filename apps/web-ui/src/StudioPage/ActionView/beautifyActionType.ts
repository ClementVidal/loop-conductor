export function beautifyActionType(type: string): string {
  const beautifiedString = type.replace(/([A-Z])/g, " $1").trim();
  return beautifiedString.charAt(0).toUpperCase() + beautifiedString.slice(1);
}
