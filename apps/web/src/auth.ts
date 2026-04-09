import type { AuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import { writeSettings } from "@/lib/settings";

export const authOptions: AuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      // Auto-populate profile settings on LinkedIn login
      const parts = (user.name ?? "").split(" ");
      const firstName = parts[0] ?? "";
      const lastName = parts.slice(1).join(" ");
      await writeSettings({ firstName, lastName }).catch(() => {});
      return true;
    },
    session({ session }) {
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ?? "scouty-dev-secret-change-in-production",
};
