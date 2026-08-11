import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RatingStars } from "@/components/product/rating-stars";
import type { Review } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ReviewItem({ review }: { review: Review }) {
  const name = review.user?.name ?? "Anonymous";

  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <RatingStars rating={review.rating} size="sm" />
      </div>
      {review.comment ? (
        <p className="text-sm leading-relaxed text-foreground/90">
          {review.comment}
        </p>
      ) : null}
    </div>
  );
}
