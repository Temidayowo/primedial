import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { sendVerificationEmail } from "@/lib/actions/verify-email.action";
import { checkRateLimit } from "@/lib/rate-limit";

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
// that reads the session (proxy.ts, dal.ts, and client components via
// useSession()) treats a session past that cutoff as logged out, via
// isSessionExpired() in @/lib/session.
//
// Tried making the session() callback below return null once expired,
// so every consumer would agree for free - but next-auth's server-side
// auth() helper (next-auth/lib/index.js) wraps this callback and
// silently substitutes its own fallback session whenever it returns
// anything falsy, so proxy.ts/dal.ts never actually saw it as logged
// out. Confirmed live: shrinking this to 3s and hitting /admin after
// the cutoff still redirected as if logged in. Reverted - each
// consumer checks isSessionExpired() explicitly instead.
const SHORT_SESSION_MS = 24 * 60 * 60 * 1000;

// Thrown from authorize() when the password is correct but the account
// hasn't clicked its verification link yet - lets the calling code
// (src/lib/actions/auth.action.ts) show a distinct message via `.code`,
// while `.type` still reads "CredentialsSignin" for anything not
// specifically checking for it.
export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

// Thrown from authorize() when too many login attempts have been made
// for this email. Lives here (not in the authenticate() action) because
// Auth.js exposes /api/auth/callback/credentials directly - a request
// straight to that route would skip a rate-limit check placed only in
// the action, so this is the one choke point every login attempt
// actually passes through regardless of how it got there.
export class RateLimitedError extends CredentialsSignin {
  code = "rate_limited";
}

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

        const allowed = await checkRateLimit(`login:${email}`, 5, 5 * 60 * 1000);
        if (!allowed) {
          throw new RateLimitedError();
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        if (!user.emailVerified) {
          throw new EmailNotVerifiedError();
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
  events: {
    // Fires once when the adapter creates a brand-new user - only
    // happens on a first-time OAuth (Google) sign-in, since credentials
    // signups create their User row directly and never go through here.
    // Auth.js's core always sets emailVerified: null for a new OAuth
    // user (see handleLoginOrRegister in @auth/core), so Google sign-ups
    // go through the same verify-email step as credentials signups -
    // the welcome email fires later, from verifyEmail() in
    // verify-email.action.ts, once they click the link.
    async createUser({ user }) {
      if (user.email) {
        await sendVerificationEmail(user.email);
      }
    },
  },
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
      }
      session.rememberUntil = token.rememberUntil as number | undefined;
      return session;
    },
  },
});
