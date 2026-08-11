import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_SIZES = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

export function RatingStars({
  rating,
  className,
  size = "md",
}: {
  rating: number;
  className?: string;
  size?: keyof typeof STAR_SIZES;
}) {
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <span key={i} className="relative inline-flex">
            <StarIcon
              className={cn(STAR_SIZES[size], "shrink-0 text-muted-foreground/40")}
            />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon
                className={cn(
                  STAR_SIZES[size],
                  "shrink-0 fill-amber-400 text-amber-400",
                )}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
