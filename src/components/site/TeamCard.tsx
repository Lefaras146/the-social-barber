import type { TeamMember } from "@/lib/site";
import { StaggerItem } from "./Reveal";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <StaggerItem className="group">
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-charcoal">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="eyebrow mb-2 text-gold">{member.role}</div>
          <h3 className="font-display text-3xl text-ivory">{member.name}</h3>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
        {member.bio}
      </p>
    </StaggerItem>
  );
}
