import { RoleType } from "@prisma/client";

export type Permission =
  | "users:manage"
  | "roles:manage"
  | "departments:manage"
  | "members:read"
  | "members:write"
  | "members:manage_status"
  | "hr:applications:read"
  | "hr:applications:review"
  | "volunteer_records:write"
  | "certificates:issue"
  | "achievements:award"
  | "articles:create"
  | "articles:edit_own"
  | "articles:edit_all"
  | "articles:publish"
  | "articles:delete"
  | "categories:manage"
  | "collections:manage"
  | "projects:read"
  | "projects:write"
  | "projects:manage";

export const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  ADMIN: [
    "users:manage",
    "roles:manage",
    "departments:manage",
    "members:read",
    "members:write",
    "members:manage_status",
    "hr:applications:read",
    "hr:applications:review",
    "volunteer_records:write",
    "certificates:issue",
    "achievements:award",
    "articles:create",
    "articles:edit_own",
    "articles:edit_all",
    "articles:publish",
    "articles:delete",
    "categories:manage",
    "collections:manage",
    "projects:read",
    "projects:write",
    "projects:manage",
  ],
  HR_EDITOR: [
    "members:read",
    "members:write",
    "members:manage_status",
    "hr:applications:read",
    "hr:applications:review",
    "volunteer_records:write",
    "certificates:issue",
    "achievements:award",
    "projects:read",
  ],
  POST_EDITOR: [
    "articles:create",
    "articles:edit_own",
    "articles:edit_all",
    "articles:publish",
    "articles:delete",
    "categories:manage",
    "collections:manage",
    "members:read",
  ],
  AUTHOR: [
    "articles:create",
    "articles:edit_own",
    "members:read",
  ],
  MEMBER: [
    "members:read",
    "projects:read",
  ],
};

export function hasPermission(userRoles: RoleType[], permission: Permission): boolean {
  if (userRoles.includes("ADMIN")) return true;
  return userRoles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
}
