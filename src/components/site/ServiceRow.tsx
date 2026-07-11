import type { Service } from "@/lib/site";
import { LuxeLink } from "./LuxeButton";
import { StaggerItem } from "./Reveal";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <StaggerItem>
      <div className="group grid grid-cols-12 gap-6 items-baseline py-7 border-t border-white/8 transition-colors duration-500 hover:border-gold/40">
        <div className="col-span-12 md:col-span-8">
          <h3 className="font-display text-2xl md:text-3xl text-ivory group-hover:text-gold transition-colors duration-500">
            {service.name}
          </h3>
        </div>
        <div className="col-span-12 md:col-span-4 flex md:justify-end items-center">
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
      <div className="group grid grid-cols-12 gap-6 items-center py-7 border-t border-white/8 transition-colors duration-500 hover:border-gold/40">
        <div className="col-span-8 md:col-span-8">
          <h3 className="font-display text-2xl md:text-3xl text-ivory group-hover:text-gold transition-colors duration-500">
            {service.name}
          </h3>
        </div>
        <div className="col-span-4 md:col-span-2 font-display text-2xl text-ivory md:text-right">
          {service.price}
        </div>
        <div className="col-span-12 md:col-span-2 md:justify-self-end">
          <LuxeLink to="/book" variant="outline" className="!px-5 !py-3">
            Ραντεβού
          </LuxeLink>
        </div>
      </div>
    </StaggerItem>
  );
}
