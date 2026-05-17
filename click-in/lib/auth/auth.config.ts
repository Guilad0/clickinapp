import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/tree") || nextUrl.pathname.startsWith("/editor") || nextUrl.pathname.startsWith("/blog") || nextUrl.pathname.startsWith("/settings") || nextUrl.pathname.startsWith("/assets");

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn) {
        return Response.redirect(new URL("/tree", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        (token as Record<string, unknown>).id = user.id ?? "";
        (token as Record<string, unknown>).role = user.role ?? "EDITOR";
        (token as Record<string, unknown>).tenantId = user.tenantId ?? null;
      }
      return token;
    },
    session({ session, token }) {
      const t = token as Record<string, unknown>;
      return {
        ...session,
        user: {
          ...session.user,
          id: (t.id ?? "") as string,
          role: (t.role ?? "EDITOR") as "OWNER" | "ADMIN" | "EDITOR" | "VIEWER",
          tenantId: (t.tenantId ?? null) as string | null,
        },
      };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
