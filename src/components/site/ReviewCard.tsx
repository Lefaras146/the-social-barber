import type { Review } from "@/lib/site";
import { Star } from "lucide-react";
import { StaggerItem } from "./Reveal";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <StaggerItem>
      <figure className="card-elegant p-8 md:p-10 h-full flex flex-col">
        <div className="flex items-center gap-1 text-gold mb-6">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-gold" strokeWidth={0} />
          ))}
        </div>
        <blockquote className="font-display text-2xl md:text-[1.65rem] leading-snug text-ivory">
          “{review.quote}”
        </blockquote>
        <figcaption className="mt-8 pt-6 border-t border-white/8 flex items-center justify-between">
          <span className="text-sm text-ivory">{review.name}</span>
          <span className="eyebrow text-[0.6rem]">{review.meta}</span>
        </figcaption>
      </figure>
    </StaggerItem>
  );
}
