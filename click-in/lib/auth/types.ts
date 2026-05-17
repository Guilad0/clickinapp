import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId: string | null;
      role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
    tenantId?: string | null;
  }
}
