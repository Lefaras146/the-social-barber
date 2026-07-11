import type { Service } from "@/lib/site";
import { LuxeLink } from "./LuxeButton";
import { StaggerItem } from "./Reveal";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <StaggerItem>
      <div className="group grid grid-cols-12 gap-6 items-baseline py-8 border-t border-white/8 transition-colors duration-500 hover:border-gold/40">
        <div className="col-span-12 md:col-span-1 eyebrow text-muted-foreground">
          {service.duration}
        </div>
        <div className="col-span-12 md:col-span-5">
          <h3 className="font-display text-3xl md:text-4xl text-ivory group-hover:text-gold transition-colors duration-500">
            {service.name}
          </h3>
        </div>
        <p className="col-span-12 md:col-span-4 text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>
        <div className="col-span-12 md:col-span-2 flex md:justify-end items-center gap-6">
          <span className="font-display text-2xl text-ivory">
            {service.price}
          </span>
        </div>
      </div>
    </StaggerItem>
  );
}

export function ServiceRowBook({ service }: { service: Service }) {
  return (
    <StaggerItem>
      <div className="group grid grid-cols-12 gap-6 items-center py-8 border-t border-white/8 transition-colors duration-500 hover:border-gold/40">
        <div className="col-span-6 md:col-span-1 eyebrow text-muted-foreground">
          {service.duration}
        </div>
        <div className="col-span-12 md:col-span-4">
          <h3 className="font-display text-2xl md:text-3xl text-ivory group-hover:text-gold transition-colors duration-500">
            {service.name}
          </h3>
        </div>
        <p className="col-span-12 md:col-span-4 text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>
        <div className="col-span-6 md:col-span-1 font-display text-xl text-ivory md:text-right">
          {service.price}
        </div>
        <div className="col-span-12 md:col-span-2 md:justify-self-end">
          <LuxeLink to="/book" variant="outline" className="!px-5 !py-3">
            Book
          </LuxeLink>
        </div>
      </div>
    </StaggerItem>
  );
}
