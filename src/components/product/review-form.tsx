"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarIcon } from "lucide-react";
import { api } from "@/lib/client-api";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ReviewForm({
  productId,
  existing,
}: {
  productId: string;
  existing?: Review;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(action: "create" | "update") {
    setPending(true);
    setError(null);
    const body = { rating, comment, productId };
    const res = await api<Review>(
      action === "create" ? "/reviews" : `/reviews/${existing!.id}`,
      {
        method: action === "create" ? "POST" : "PATCH",
        body: JSON.stringify(
          action === "create" ? body : { rating, comment },
        ),
      },
    );
    setPending(false);
    if (res.status >= 400 || !res.data) {
      setError(res.message || "Something went wrong");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (!existing) return;
    setPending(true);
    setError(null);
    const res = await api<Review>(`/reviews/${existing.id}`, {
      method: "DELETE",
    });
    setPending(false);
    if (res.status >= 400) {
      setError(res.message || "Something went wrong");
      return;
    }
    router.refresh();
  }

  const active = hover || rating;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="rating">Rating</Label>
        <div
          id="rating"
          className="flex items-center gap-1"
          role="radiogroup"
          aria-label="Rating"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              className="cursor-pointer rounded-sm p-0.5"
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(value)}
            >
              <StarIcon
                className={cn(
                  "size-6 transition-colors",
                  value <= active
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40",
                )}
              />
            </button>
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {rating} of 5
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => save(existing ? "update" : "create")}
          disabled={pending}
        >
          {existing ? "Update review" : "Submit review"}
        </Button>
        {existing ? (
          <Button
            type="button"
            variant="destructive"
            onClick={remove}
            disabled={pending}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}
