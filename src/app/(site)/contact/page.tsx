import Header from "@/components/header";
import ContactPageContent from "./contactContent";

const ContactPage = () => {
  return (
    <>
      <Header
        theme="dark"
        mobileClassName="absolute top-0 left-0 z-50 w-full bg-transparent  border-b-0"
      />
      <ContactPageContent />
    </>
  );
};

export default ContactPage;
