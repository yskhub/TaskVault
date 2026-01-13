export type Role = "admin" | "member";

export function canManageTeam(role: Role) {
  return role === "admin";
}

export function canEditWorkflow(role: Role) {
  return role === "admin";
}
