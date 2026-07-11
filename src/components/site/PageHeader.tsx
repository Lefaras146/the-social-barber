import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <header className="container-luxe pt-40 pb-20 md:pt-52 md:pb-28">
      <Reveal>
        <div className="eyebrow mb-8">{eyebrow}</div>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[1] max-w-4xl text-ivory">
          {title}
        </h1>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </Reveal>
      ) : null}
      <div className="hairline mt-16" />
    </header>
  );
}
