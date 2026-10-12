import "server-only";
import { prisma } from "@/lib/prisma";

// Public-site reads for the CMS sections managed under /admin. Only
// published entries, in the admin-chosen order (ties: oldest first).

const displayOrder = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

const transientConnectionCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "EAI_AGAIN",
  "ENETUNREACH",
  "ETIMEDOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
]);

function isTransientConnectionError(
  error: unknown,
  seen = new Set<object>(),
): boolean {
  if (typeof error !== "object" || error === null || seen.has(error)) {
    return false;
  }

  seen.add(error);
  const candidate = error as {
    cause?: unknown;
    code?: unknown;
    errors?: unknown;
    sourceError?: unknown;
  };

  if (
    typeof candidate.code === "string" &&
    transientConnectionCodes.has(candidate.code)
  ) {
    return true;
  }

  const nestedErrors = [
    candidate.cause,
    candidate.sourceError,
    ...(Array.isArray(candidate.errors) ? candidate.errors : []),
  ];

  return nestedErrors.some((nestedError) =>
    isTransientConnectionError(nestedError, seen),
  );
}

async function retryTransientContentRead<T>(
  read: () => Promise<T[]>,
): Promise<T[]> {
  try {
    return await read();
  } catch (error) {
    if (!isTransientConnectionError(error)) {
      throw error;
    }

    // These public CMS reads are safe to retry because they do not mutate data.
    console.warn(
      "Transient database connection error while loading public content; retrying once.",
    );
    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      return await read();
    } catch (retryError) {
      if (!isTransientConnectionError(retryError)) {
        throw retryError;
      }

      console.error(
        "[public content] Database unavailable after retry; rendering optional CMS content as empty.",
        retryError,
      );
      return [];
    }
  }
}

export function getPublishedProjects() {
  return retryTransientContentRead(() =>
    prisma.project.findMany({
      where: { isPublished: true },
      orderBy: displayOrder,
    }),
  );
}

export function getPublishedTeamMembers() {
  return retryTransientContentRead(() =>
    prisma.teamMember.findMany({
      where: { isPublished: true },
      orderBy: displayOrder,
    }),
  );
}

export function getPublishedTestimonials() {
  return retryTransientContentRead(() =>
    prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: displayOrder,
    }),
  );
}

export function getPublishedPartners() {
  return retryTransientContentRead(() =>
    prisma.partner.findMany({
      where: { isPublished: true },
      orderBy: displayOrder,
    }),
  );
}

export function getPublishedSocialLinks() {
  return retryTransientContentRead(() =>
    prisma.socialLink.findMany({
      where: { isPublished: true },
      orderBy: displayOrder,
    }),
  );
}

export function getServiceRequestCategories() {
  return retryTransientContentRead(() =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  );
}
