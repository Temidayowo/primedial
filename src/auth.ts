import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  loginType: z.enum(["user", "admin"]).optional(),
  remember: z.string().optional(),
});

// Auth.js signs the session cookie with a fixed 30-day maxAge regardless
// of what's returned here - there's no per-sign-in hook to shorten the
// cookie itself. So "Remember me" unchecked doesn't shrink the cookie;
// instead it stamps the token with an earlier cutoff, and every place
// that reads the session (proxy.ts, dal.ts) treats a session past that
// cutoff as logged out, via isSessionExpired() in @/lib/session.
const SHORT_SESSION_MS = 24 * 60 * 60 * 1000;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = credentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password, loginType, remember } = validatedFields.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        // The admin login form sets loginType: "admin" - reject anyone
        // without the ADMIN role even if their credentials are valid.
        if (loginType === "admin" && user.role !== Role.ADMIN) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          remember: remember === "on",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // OAuth/signup sign-ins never set `remember` - treat those as
        // remembered (no early cutoff), same as checking the box.
        token.rememberUntil =
          user.remember === false ? Date.now() + SHORT_SESSION_MS : undefined;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.rememberUntil = token.rememberUntil as number | undefined;
      }
      return session;
    },
  },
});
