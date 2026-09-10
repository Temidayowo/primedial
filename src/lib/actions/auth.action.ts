"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, EmailNotVerifiedError } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/actions/verify-email.action";
import { RateLimitedError } from "@/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type LoginContext = "user" | "admin";

export async function authenticate(
  context: LoginContext,
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      loginType: context,
      remember: formData.get("remember"),
      redirectTo: context === "admin" ? "/admin" : "/",
    });
  } catch (error) {
    if (error instanceof EmailNotVerifiedError) {
      return "Please verify your email before logging in - check your inbox for the verification link.";
    }
    if (error instanceof RateLimitedError) {
      return "Too many login attempts. Please wait a few minutes and try again.";
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    throw error;
  }
}

export async function signInWithGoogle(prevState: string | undefined) {
  try {
    // Route through a gate page instead of "/" directly - it checks
    // whether this account is verified yet and sends unverified Google
    // sign-ups to the "check your email" page instead of straight home.
    await signIn("google", { redirectTo: "/auth/post-signin" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthAccountNotLinked":
          return "An account already exists with this email. Log in with your password instead, or use 'Forgot password' if you don't remember it.";
        default:
          return "Something went wrong signing in with Google. Please try again.";
      }
    }
    throw error;
  }
}

const signupSchema = z
  .object({
    name: z.string().min(2, { error: "Name must be at least 2 characters." }).trim(),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, { error: "Contain at least one special character." }),
    confirmPassword: z.string(),
    terms: z.literal("on", { error: "You must agree to the terms to continue." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        terms?: string[];
      };
      message?: string;
      verificationSent?: boolean;
    }
  | undefined;

export async function signup(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const validatedFields = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms"),
  });

  if (!validatedFields.success) {
    return { errors: z.flattenError(validatedFields.error).fieldErrors };
  }

  const { name, email, password } = validatedFields.data;

  const allowed = await checkRateLimit(`signup:${email}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return { message: "Too many attempts. Please try again later." };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { message: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  await sendVerificationEmail(email);

  return { verificationSent: true };
}
