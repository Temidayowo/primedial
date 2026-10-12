import { getServiceRequestCategories } from "@/lib/content";
import { RequestServiceFormFields } from "./requestServiceFormFields";

// Server wrapper: loads the equipment categories for the dropdown, the
// interactive form itself is a client component.
const RequestServiceForm = async () => {
  const categories = await getServiceRequestCategories();

  return <RequestServiceFormFields categories={categories} />;
};

export default RequestServiceForm;
