import { type DefaultSession } from "next-auth";
import { type Role } from "@/generated/prisma/enums";

declare module "next-auth" {
  interface User {
    role?: Role;
    remember?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
    rememberUntil?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    rememberUntil?: number;
  }
}
