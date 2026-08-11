"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import type { Review } from "@/lib/types";
import { ReviewItem } from "@/components/product/review-item";
import { ReviewForm } from "@/components/product/review-form";
import { Button } from "@/components/ui/button";

export function MyReview({
  productId,
  review,
}: {
  productId: string;
  review?: Review;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!review) {
    return <ReviewForm productId={productId} />;
  }

  if (editing) {
    return (
      <ReviewForm
        productId={productId}
        existing={review}
        hideDelete
        onDone={() => setEditing(false)}
      />
    );
  }

  const current = review;

  async function remove() {
    setDeleting(true);
    setError(null);
    const res = await api<Review>(`/reviews/${current.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (res.status >= 400) {
      setError(res.message || "Something went wrong");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <ReviewItem review={review} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditing(true)}
        >
          Update
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={remove}
          disabled={deleting}
        >
          {deleting ? "Removing..." : "Remove"}
        </Button>
      </div>
    </div>
  );
}
