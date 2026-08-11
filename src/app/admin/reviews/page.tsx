import type { Metadata } from "next";
import { serverFetch } from "@/lib/api";
import type { Review } from "@/lib/types";
import { ReviewManager } from "@/components/admin/review-manager";

export const metadata: Metadata = {
  title: "Admin reviews",
};

export default async function AdminReviewsPage() {
  const { data: reviews } = await serverFetch<Review[]>("/reviews");

  return <ReviewManager reviews={reviews ?? []} />;
}
