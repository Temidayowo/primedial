import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Landing spot for signInWithGoogle()'s redirectTo - by the time this
// renders, the session cookie is already set, so we can check whether
// this account still needs to verify its email and route accordingly,
// instead of always dropping Google sign-ins straight on the homepage.
export default async function PostSignInPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true },
  });

  if (!user?.emailVerified) {
    redirect("/verify-email-pending");
  }

  redirect("/");
}
