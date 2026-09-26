import type { Metadata } from "next";
import { Star } from "lucide-react";
import {
  deleteTestimonial,
  getTestimonialsAdmin,
} from "@/lib/actions/admin/testimonials.action";
import { DeleteContentButton } from "@/components/admin/content/delete-content-button";
import {
  ContentEmptyState,
  ContentListHeader,
  ContentTable,
  EditLink,
  PublishedBadge,
} from "@/components/admin/content/list-ui";

export const metadata: Metadata = {
  title: "Testimonials",
};

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonialsAdmin();

  return (
    <div>
      <ContentListHeader
        title="Testimonials"
        description="Shown in What Our Clients Say on the home page."
        count={testimonials.length}
        noun={["testimonial", "testimonials"]}
        addHref="/admin/testimonials/new"
        addLabel="Add Testimonial"
      />

      {testimonials.length === 0 ? (
        <ContentEmptyState message="No testimonials yet. The section is hidden on the site until you add one." />
      ) : (
        <ContentTable headers={["Client", "Testimonial", "Rating", "Order", "Status", "Actions"]}>
          {testimonials.map((testimonial) => (
            <tr key={testimonial.id} className="border-b border-gray-50 align-top last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-blue">{testimonial.name}</p>
                <p className="text-xs text-slate-400">{testimonial.role}</p>
              </td>
              <td className="max-w-sm px-4 py-3 text-slate-500">
                <p className="line-clamp-2">{testimonial.content}</p>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 text-slate-500">
                  {testimonial.rating}
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{testimonial.sortOrder}</td>
              <td className="px-4 py-3">
                <PublishedBadge isPublished={testimonial.isPublished} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <EditLink
                    href={`/admin/testimonials/${testimonial.id}`}
                    label={`Edit testimonial from ${testimonial.name}`}
                  />
                  <DeleteContentButton
                    action={deleteTestimonial.bind(null, testimonial.id)}
                    itemName={`testimonial from ${testimonial.name}`}
                  />
                </div>
              </td>
            </tr>
          ))}
        </ContentTable>
      )}
    </div>
  );
}
