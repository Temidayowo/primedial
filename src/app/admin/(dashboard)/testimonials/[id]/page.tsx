import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getTestimonialByIdAdmin,
  updateTestimonial,
} from "@/lib/actions/admin/testimonials.action";
import { TestimonialForm } from "@/components/admin/content/testimonial-form";
import { ContentFormPage } from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Edit Testimonial",
};

export default async function EditTestimonialPage({
  params,
}: PageProps<"/admin/testimonials/[id]">) {
  const { id } = await params;
  const testimonial = await getTestimonialByIdAdmin(id);
  if (!testimonial) notFound();

  return (
    <ContentFormPage
      title="Edit Testimonial"
      backHref="/admin/testimonials"
      backLabel="All testimonials"
    >
      <TestimonialForm
        action={updateTestimonial.bind(null, id)}
        testimonial={testimonial}
        submitLabel="Save Changes"
      />
    </ContentFormPage>
  );
}
