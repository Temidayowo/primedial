import type { Metadata } from "next";
import { createTestimonial } from "@/lib/actions/admin/testimonials.action";
import { TestimonialForm } from "@/components/admin/content/testimonial-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Add Testimonial",
};

export default function NewTestimonialPage() {
  return (
    <ContentFormPage
      title="Add Testimonial"
      backHref="/admin/testimonials"
      backLabel="All testimonials"
    >
      <TestimonialForm action={createTestimonial} submitLabel="Add Testimonial" />
    </ContentFormPage>
  );
}
