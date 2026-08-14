import { prisma } from "@/app/(server)/lib/prisma";
import { getDictionary } from "@/lib/dictionaries";
import { requireAccountSession } from "@/lib/auth/require-account-session";
import type { Metadata } from "next";
import { MyReviewsClient } from "./_components/MyReviewsClient";

export const metadata: Metadata = {
  title: "Moje recenzije",
  robots: { index: false, follow: false },
};

async function getUserReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    include: {
      facility: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function MojeRecenzijePage() {
  const session = await requireAccountSession("/moje-recenzije");
  const dict = await getDictionary();
  const t = dict.account as Record<string, string>;
  const labels = {
    title: t.moje_recenzije ?? "Moje recenzije",
    description:
      t.reviews_desc ?? "Uredite tekst, proverite status i pratite sve objavljene utiske.",
    noReviews: t.no_reviews ?? "Još uvek niste napisali nijednu recenziju.",
    editReview: t.edit_review ?? "Izmeni",
    deleteReview: t.delete_review ?? "Obriši",
    save: t.save_profile ?? "Sačuvaj",
    cancel: t.cancel ?? "Otkaži",
    rating: t.rating ?? "Ocena",
    pending: t.review_pending ?? "Čeka odobrenje",
    published: t.review_published ?? "Objavljeno",
    viewFacility: t.view_facility ?? "Pogledaj objekat",
    deleted: t.review_deleted ?? "Recenzija obrisana",
    saved: t.review_saved ?? "Recenzija sačuvana",
    titlePlaceholder: t.review_title_placeholder ?? "Naslov recenzije",
    contentPlaceholder: t.review_content_placeholder ?? "Podelite svoje iskustvo",
    genericError: t.generic_error ?? "Došlo je do greške",
  };

  const reviews = await getUserReviews(session.user.id);

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic sm:text-3xl">
          {labels.title}
        </h1>
        <p className="text-muted-foreground text-sm font-medium">{labels.description}</p>
      </div>

      <MyReviewsClient
        reviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          content: r.content,
          isApproved: r.isApproved,
          facility: r.facility,
        }))}
        labels={{
          no_reviews: labels.noReviews,
          edit_review: labels.editReview,
          delete_review: labels.deleteReview,
          save: labels.save,
          cancel: labels.cancel,
          rating: labels.rating,
          pending: labels.pending,
          published: labels.published,
          view_facility: labels.viewFacility,
          deleted: labels.deleted,
          saved: labels.saved,
          title_placeholder: labels.titlePlaceholder,
          content_placeholder: labels.contentPlaceholder,
          generic_error: labels.genericError,
        }}
      />
    </div>
  );
}
