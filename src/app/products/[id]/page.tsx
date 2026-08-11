import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageIcon } from "lucide-react";
import { serverFetch } from "@/lib/api";
import type { Product, Review } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/product/rating-stars";
import { ReviewForm } from "@/components/product/review-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await serverFetch<Product>(`/products/${id}`);
  return { title: data?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const [{ data: product }, { data: reviews }] = await Promise.all([
    serverFetch<Product>(`/products/${id}`),
    serverFetch<Review[]>(`/reviews/product/${id}`),
  ]);

  if (!product) notFound();

  const reviewList = reviews ?? [];
  const average =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
      : 0;
  const myReview = session
    ? reviewList.find((r) => r.userId === session.id)
    : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <Button variant="link" asChild className="mb-4 px-0">
        <Link href="/products">&larr; Back to products</Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <PackageIcon className="size-16" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {product.category?.name ?? "Product"}
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <RatingStars rating={Math.round(average)} />
            <span className="text-sm text-muted-foreground">
              {average > 0 ? average.toFixed(1) : "No reviews yet"}
            </span>
          </div>
          <p className="text-2xl font-semibold">
            {formatPrice(product.price)}
          </p>
          <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="w-fit">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Sold out"}
          </Badge>
          {product.description ? (
            <p className="text-muted-foreground">{product.description}</p>
          ) : null}
        </div>
      </div>

      <Separator className="my-10" />

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Reviews ({reviewList.length})
          </h2>
          {reviewList.length > 0 ? (
            <div className="mt-4 flex flex-col divide-y">
              {reviewList.map((review) => (
                <div key={review.id} className="flex flex-col gap-1 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {review.user?.name ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <RatingStars rating={review.rating} />
                  {review.comment ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              Be the first to review this product.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {myReview ? "Your review" : "Write a review"}
          </h2>
          {session ? (
            <div className="mt-4">
              <ReviewForm productId={product.id} existing={myReview} />
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              <Button variant="link" asChild className="px-0">
                <Link href={`/login?next=${encodeURIComponent(`/products/${product.id}`)}`}>
                  Sign in
                </Link>
              </Button>{" "}
              to leave a review.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
