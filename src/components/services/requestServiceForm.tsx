import { prisma } from "@/lib/prisma";
import { RequestServiceFormFields } from "./requestServiceFormFields";

// Server wrapper: loads the equipment categories for the dropdown, the
// interactive form itself is a client component.
const RequestServiceForm = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <RequestServiceFormFields categories={categories} />;
};

export default RequestServiceForm;
