"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/client-api";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RATINGS = [5, 4, 3, 2, 1];

export function ReviewForm({
  productId,
  existing,
}: {
  productId: string;
  existing?: Review;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(String(existing?.rating ?? 5));
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(action: "create" | "update") {
    setPending(true);
    setError(null);
    const body = { rating: Number(rating), comment, productId };
    const res = await api<Review>(
      action === "create" ? "/reviews" : `/reviews/${existing!.id}`,
      {
        method: action === "create" ? "POST" : "PATCH",
        body: JSON.stringify(action === "create" ? body : { rating: Number(rating), comment }),
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

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rating">Rating</Label>
        <Select
          value={rating}
          onValueChange={(value) => {
            if (value) setRating(value);
          }}
        >
          <SelectTrigger id="rating" className="w-40">
            <SelectValue>{rating} star{rating === "1" ? "" : "s"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {RATINGS.map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} star{r === 1 ? "" : "s"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
