"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RatingStars } from "@/components/product/rating-stars";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ReviewManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<Review | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (!deleting) return;
    setPending(true);
    setError(null);
    const res = await api<Review>(`/reviews/${deleting.id}`, {
      method: "DELETE",
    });
    setPending(false);
    if (res.status >= 400) {
      setError(res.message || "Delete failed");
      return;
    }
    setDeleting(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">
            {reviews.length} reviews
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      ) : null}

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No reviews yet.
              </TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0"
                    render={
                      <Link href={`/products/${review.productId}`} />
                    }
                  >
                    {review.product?.name ?? "Product"}
                  </Button>
                </TableCell>
                <TableCell>{review.user?.name ?? "Anonymous"}</TableCell>
                <TableCell>
                  <RatingStars rating={review.rating} />
                </TableCell>
                <TableCell className="max-w-60">
                  <span className="line-clamp-2 text-muted-foreground">
                    {review.comment ?? "—"}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleting(review)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete review"
        description="Delete this review? This is a soft delete."
        onConfirm={remove}
        pending={pending}
      />
    </div>
  );
}
