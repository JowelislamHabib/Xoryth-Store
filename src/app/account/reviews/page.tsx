import type { Metadata } from "next";
import Link from "next/link";
import { serverFetch } from "@/lib/api";
import type { Review } from "@/lib/types";
import { getSession } from "@/lib/session";
import { RatingStars } from "@/components/product/rating-stars";
import { ReviewForm } from "@/components/product/review-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "My reviews",
};

export default async function MyReviewsPage() {
  const session = (await getSession())!;
  const { data: reviews } = await serverFetch<Review[]>("/reviews");

  const mine = (reviews ?? []).filter((r) => r.userId === session.id);

  if (mine.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">
          You have not written any reviews yet.
        </p>
        <Button render={<Link href="/products" />}>Browse products</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {mine.map((review) => (
        <Card key={review.id}>
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link
                href={`/products/${review.productId}`}
                className="font-medium hover:underline"
              >
                {review.product?.name ?? "Product"}
              </Link>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <RatingStars rating={review.rating} />
            {review.comment ? (
              <p className="text-sm leading-relaxed text-foreground/90">
                {review.comment}
              </p>
            ) : null}
            <Separator />
            <ReviewForm productId={review.productId} existing={review} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
